import type * as CommandExecutor from "@effect/platform/CommandExecutor"
import type { PlatformError } from "@effect/platform/Error"
import { readFileSync } from "node:fs"
import { Effect } from "effect"

import { runCommandCapture, runCommandExitCode, runCommandWithExitCodes } from "./command-runner.js"

export type DockerVolume = {
  readonly hostPath: string
  readonly containerPath: string
}

export type DockerAuthSpec = {
  readonly cwd: string
  readonly image: string
  readonly volume: DockerVolume
  readonly entrypoint?: string
  readonly user?: string
  readonly env?: string | ReadonlyArray<string>
  readonly args: ReadonlyArray<string>
  readonly interactive: boolean
}

type DockerMountBinding = {
  readonly source: string
  readonly destination: string
}

const resolveEnvValue = (key: string): string | null => {
  const value = process.env[key]?.trim()
  return value && value.length > 0 ? value : null
}

const trimTrailingSlash = (value: string): string => value.replace(/[\\/]+$/u, "")

const pathStartsWith = (candidate: string, prefix: string): boolean =>
  candidate === prefix || candidate.startsWith(`${prefix}/`) || candidate.startsWith(`${prefix}\\`)

const translatePathPrefix = (candidate: string, sourcePrefix: string, targetPrefix: string): string | null =>
  pathStartsWith(candidate, sourcePrefix)
    ? `${targetPrefix}${candidate.slice(sourcePrefix.length)}`
    : null

const resolveContainerProjectsRoot = (): string | null => {
  const explicit = resolveEnvValue("DOCKER_GIT_PROJECTS_ROOT")
  if (explicit !== null) {
    return explicit
  }

  const home = resolveEnvValue("HOME") ?? resolveEnvValue("USERPROFILE")
  return home === null ? null : `${trimTrailingSlash(home)}/.docker-git`
}

const resolveProjectsRootHostOverride = (): string | null => resolveEnvValue("DOCKER_GIT_PROJECTS_ROOT_HOST")

const resolveCurrentContainerId = (): string | null => {
  const fromEnv = resolveEnvValue("HOSTNAME")
  if (fromEnv !== null) {
    return fromEnv
  }

  try {
    const fromHostnameFile = readFileSync("/etc/hostname", "utf8").trim()
    return fromHostnameFile.length > 0 ? fromHostnameFile : null
  } catch {
    return null
  }
}

const parseDockerInspectMounts = (raw: string): ReadonlyArray<DockerMountBinding> => {
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.flatMap((item) => {
      if (typeof item !== "object" || item === null) {
        return []
      }
      const source = Reflect.get(item, "Source")
      const destination = Reflect.get(item, "Destination")
      return typeof source === "string" && typeof destination === "string"
        ? [{ source, destination }]
        : []
    })
  } catch {
    return []
  }
}

export const remapDockerBindHostPathFromMounts = (
  hostPath: string,
  mounts: ReadonlyArray<DockerMountBinding>
): string => {
  const match = mounts
    .filter((mount) => pathStartsWith(hostPath, mount.destination))
    .sort((left, right) => right.destination.length - left.destination.length)[0]

  if (match === undefined) {
    return hostPath
  }

  return `${match.source}${hostPath.slice(match.destination.length)}`
}

export const resolveDockerVolumeHostPath = (
  cwd: string,
  hostPath: string
): Effect.Effect<string, never, CommandExecutor.CommandExecutor> =>
  Effect.gen(function*(_) {
    const containerProjectsRoot = resolveContainerProjectsRoot()
    const hostProjectsRoot = resolveProjectsRootHostOverride()
    if (containerProjectsRoot !== null && hostProjectsRoot !== null) {
      const remapped = translatePathPrefix(hostPath, containerProjectsRoot, hostProjectsRoot)
      if (remapped !== null) {
        return remapped
      }
    }

    const containerId = resolveCurrentContainerId()
    if (containerId === null) {
      return hostPath
    }

    const mountsJson = yield* _(
      runCommandCapture(
        {
          cwd,
          command: "docker",
          args: ["inspect", containerId, "--format", "{{json .Mounts}}"]
        },
        [0],
        () => new Error("docker inspect current container failed")
      ).pipe(Effect.orElseSucceed(() => ""))
    )

    return remapDockerBindHostPathFromMounts(hostPath, parseDockerInspectMounts(mountsJson))
  })

export const resolveDefaultDockerUser = (): string | null => {
  const getUid = Reflect.get(process, "getuid")
  const getGid = Reflect.get(process, "getgid")
  if (typeof getUid !== "function" || typeof getGid !== "function") {
    return null
  }
  const uid = getUid.call(process)
  const gid = getGid.call(process)
  if (typeof uid !== "number" || typeof gid !== "number") {
    return null
  }
  return `${uid}:${gid}`
}

const appendEnvArgs = (base: Array<string>, env: string | ReadonlyArray<string>) => {
  if (typeof env === "string") {
    const trimmed = env.trim()
    if (trimmed.length > 0) {
      base.push("-e", trimmed)
    }
    return
  }
  for (const entry of env) {
    const trimmed = entry.trim()
    if (trimmed.length === 0) {
      continue
    }
    base.push("-e", trimmed)
  }
}

const buildDockerArgs = (spec: DockerAuthSpec): ReadonlyArray<string> => {
  const base: Array<string> = ["run", "--rm"]
  const dockerUser = (spec.user ?? "").trim() || resolveDefaultDockerUser()
  if (dockerUser !== null) {
    base.push("--user", dockerUser)
  }
  if (spec.interactive) {
    base.push("-it")
  }
  if (spec.entrypoint && spec.entrypoint.length > 0) {
    base.push("--entrypoint", spec.entrypoint)
  }
  base.push("-v", `${spec.volume.hostPath}:${spec.volume.containerPath}`)
  if (spec.env !== undefined) {
    appendEnvArgs(base, spec.env)
  }
  return [...base, spec.image, ...spec.args]
}

// CHANGE: expose docker CLI args builder for advanced auth flows (stdin piping)
// WHY: some OAuth CLIs (Claude Code) don't reliably render their input UI; docker-git needs to drive stdin explicitly
// REF: issue-61
// SOURCE: n/a
// PURITY: CORE
// INVARIANT: args match those used by runDockerAuth / runDockerAuthCapture
export const buildDockerAuthArgs = (spec: DockerAuthSpec): ReadonlyArray<string> => buildDockerArgs(spec)

// CHANGE: run a docker auth command with controlled exit codes
// WHY: reuse container auth flow for gh/codex
// QUOTE(ТЗ): "поднимал отдельный контейнер где будет установлен чисто gh или чисто codex"
// REF: user-request-2026-01-28-auth
// SOURCE: n/a
// FORMAT THEOREM: forall cmd: exitCode(cmd) in ok -> success
// PURITY: SHELL
// EFFECT: Effect<void, PlatformError | E, CommandExecutor>
// INVARIANT: container is removed after execution
// COMPLEXITY: O(command)
export const runDockerAuth = <E>(
  spec: DockerAuthSpec,
  okExitCodes: ReadonlyArray<number>,
  onFailure: (exitCode: number) => E
): Effect.Effect<void, E | PlatformError, CommandExecutor.CommandExecutor> =>
  Effect.gen(function*(_) {
    const hostPath = yield* _(resolveDockerVolumeHostPath(spec.cwd, spec.volume.hostPath))
    yield* _(
      runCommandWithExitCodes(
        {
          cwd: spec.cwd,
          command: "docker",
          args: buildDockerArgs({ ...spec, volume: { ...spec.volume, hostPath } })
        },
        okExitCodes,
        onFailure
      )
    )
  })

// CHANGE: run a docker auth command and capture stdout
// WHY: obtain tokens from container auth flows
// QUOTE(ТЗ): "поднимал отдельный контейнер где будет установлен чисто gh или чисто codex"
// REF: user-request-2026-01-28-auth
// SOURCE: n/a
// FORMAT THEOREM: forall cmd: capture(cmd) -> stdout
// PURITY: SHELL
// EFFECT: Effect<string, PlatformError | E, CommandExecutor>
// INVARIANT: container is removed after execution
// COMPLEXITY: O(command)
export const runDockerAuthCapture = <E>(
  spec: DockerAuthSpec,
  okExitCodes: ReadonlyArray<number>,
  onFailure: (exitCode: number) => E
): Effect.Effect<string, E | PlatformError, CommandExecutor.CommandExecutor> =>
  Effect.gen(function*(_) {
    const hostPath = yield* _(resolveDockerVolumeHostPath(spec.cwd, spec.volume.hostPath))
    return yield* _(
      runCommandCapture(
        {
          cwd: spec.cwd,
          command: "docker",
          args: buildDockerArgs({ ...spec, volume: { ...spec.volume, hostPath } })
        },
        okExitCodes,
        onFailure
      )
    )
  })

// CHANGE: run a docker auth command and return the exit code
// WHY: allow status checks without throwing
// QUOTE(ТЗ): "поднимал отдельный контейнер где будет установлен чисто gh или чисто codex"
// REF: user-request-2026-01-28-auth
// SOURCE: n/a
// FORMAT THEOREM: forall cmd: exitCode(cmd) = n
// PURITY: SHELL
// EFFECT: Effect<number, PlatformError, CommandExecutor>
// INVARIANT: container is removed after execution
// COMPLEXITY: O(command)
export const runDockerAuthExitCode = (
  spec: DockerAuthSpec
): Effect.Effect<number, PlatformError, CommandExecutor.CommandExecutor> =>
  Effect.gen(function*(_) {
    const hostPath = yield* _(resolveDockerVolumeHostPath(spec.cwd, spec.volume.hostPath))
    return yield* _(
      runCommandExitCode({
        cwd: spec.cwd,
        command: "docker",
        args: buildDockerArgs({ ...spec, volume: { ...spec.volume, hostPath } })
      })
    )
  })
