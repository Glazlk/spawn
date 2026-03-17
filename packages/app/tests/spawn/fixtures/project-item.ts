import type { ProjectItem } from "@spawn-dev/lib/usecases/projects"

export const makeProjectItem = (
  overrides: Partial<ProjectItem> = {}
): ProjectItem => ({
  projectDir: "/home/dev/.spawn/org-repo",
  displayName: "org/repo",
  repoUrl: "https://github.com/org/repo.git",
  repoRef: "main",
  containerName: "dg-repo",
  serviceName: "dg-repo",
  sshUser: "dev",
  sshPort: 2222,
  targetDir: "/home/dev/org/repo",
  sshCommand: "ssh -p 2222 dev@localhost",
  sshKeyPath: null,
  authorizedKeysPath: "/home/dev/.spawn/org-repo/.spawn/authorized_keys",
  authorizedKeysExists: true,
  envGlobalPath: "/home/dev/.orch/env/global.env",
  envProjectPath: "/home/dev/.spawn/org-repo/.orch/env/project.env",
  codexAuthPath: "/home/dev/.orch/auth/codex",
  codexHome: "/home/dev/.codex",
  ...overrides
})
