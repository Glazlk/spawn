import { describe, expect, it } from "@effect/vitest"

import { remapDockerBindHostPathFromMounts } from "../../src/shell/docker-auth.js"

describe("remapDockerBindHostPathFromMounts", () => {
  it("maps nested bind paths through the current container mount source", () => {
    const next = remapDockerBindHostPathFromMounts("/home/dev/.spawn/.orch/auth/claude/default", [
      {
        source: "/home/user/.spawn",
        destination: "/home/dev/.spawn"
      }
    ])

    expect(next).toBe("/home/user/.spawn/.orch/auth/claude/default")
  })

  it("prefers the longest matching destination prefix", () => {
    const next = remapDockerBindHostPathFromMounts("/home/dev/.spawn/provercoderai/repo/.orch/auth/gh", [
      {
        source: "/home/user/.spawn",
        destination: "/home/dev/.spawn"
      },
      {
        source: "/srv/spawn/provercoderai/repo",
        destination: "/home/dev/.spawn/provercoderai/repo"
      }
    ])

    expect(next).toBe("/srv/spawn/provercoderai/repo/.orch/auth/gh")
  })

  it("keeps the original path when no mount matches", () => {
    const hostPath = "/tmp/spawn-auth"

    expect(remapDockerBindHostPathFromMounts(hostPath, [])).toBe(hostPath)
  })
})
