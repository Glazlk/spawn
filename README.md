<!-- HERO -->
<p align="center">
  <img src="https://raw.githubusercontent.com/glazlk/spawn/main/logo.svg" width="80" alt="spawn logo" />
</p>

<h1 align="center">
  <code>spawn</code>
</h1>

<p align="center">
  <strong><code>spawn(task) → isolated env + AI agent → PR. No config. No babysitting.</code></strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@spawn-dev/spawn"><img src="https://img.shields.io/npm/v/@spawn-dev/spawn?color=E8521A&labelColor=080806&label=npm&style=flat-square" alt="npm" /></a>
  <a href="https://github.com/glazlk/spawn/blob/main/LICENSE"><img src="https://img.shields.io/github/license/glazlk/spawn?color=E8521A&labelColor=080806&style=flat-square" alt="license" /></a>
  <a href="https://github.com/glazlk/spawn/stargazers"><img src="https://img.shields.io/github/stars/glazlk/spawn?color=E8521A&labelColor=080806&style=flat-square" alt="stars" /></a>
</p>

<p align="center">
  <em>Don't configure. Spawn.</em>
</p>

---

## What is spawn?

**spawn** creates a disposable Docker dev environment per GitHub issue, PR, or task. Each environment gets its own AI agent. Point. Spawn. Walk away.

```
spawn(task) → isolated container + AI agent → opens PR → container exits.
```

Environments are **mortal**. Code is not.

---

## Quickstart

```bash
# 1. install & auth (once)
npx @spawn-dev/spawn auth github login
npx @spawn-dev/spawn auth claude login

# 2. point at a task
spawn clone https://github.com/org/repo/issues/42 --auto

# 3. check your PRs
# ✓ PR opened. Agent session saved. Done.
```

> Requires Docker. Works on macOS, Linux, and WSL2.

---

## How It Works

| Step | What happens |
|------|-------------|
| **AUTH** | Connect GitHub and your AI agents. Credentials sync via a private `~/.spawn` repo. Runs **once**. |
| **CLONE** | Paste any GitHub issue, PR, or branch URL. Spawn creates an isolated Docker container with deps from shared cache. Under 90 seconds. |
| **WORK** | In `--auto` mode Claude Code or Codex reads the issue, writes code, runs tests. In `--ssh` mode you enter and work interactively. |
| **SHIP** | Agent commits, pushes, opens a PR. Session logs upload to a private Gist with a link in the PR comment. Full audit trail. |
| **DIE** | Container self-destructs. No leftover state. No drift. Next task gets a fresh spawn. |

---

## Terminal Demo

```
$ spawn auth github login --web
  ✓ Authenticated as user

$ spawn auth claude login
  ✓ Claude Code ready

$ spawn clone github.com/org/crm/issues/42 --auto
  → Spawning issue-42...
  → Image pull (cached)         0.3s
  → pnpm install (cache hit)    1.1s
  → Injecting Claude Code       0.1s
  → Agent reading issue #42...
  → Writing implementation...
  → Running test suite...        pass
  ✓ PR opened → github.com/org/crm/pull/87
  ✓ Session log → gist.github.com/user/a3f...
  → Container terminated.
```

---

## Features

### Parallel Isolation
Run issue-42 and issue-43 simultaneously. Separate containers, separate agents, zero interference. Share nothing except the package cache.

### Shared Credentials
One auth config for all containers. No token rotation issues. Each project keeps its own session state while sharing the login.

### Two AI Agents
Claude Code and Codex pre-installed in every environment. `AGENTS.md` auto-loaded with issue context. They read the task. They know what to do.

### Session Backup
On every push, AI session logs auto-upload to a private GitHub Gist. A link is posted to the PR comment. Full audit trail of what the agent did.

### Cloud State
Your `~/.spawn` directory syncs to a private GitHub repo on auth. Switch machines. Restore everything. Never reconfigure.

### Playwright MCP
Optional Chromium sidecar. Claude Code gets full browser automation through MCP protocol. Agents that can see pages, click buttons, fill forms.

---

## Commands

| Command | Description |
|---------|-------------|
| `spawn auth github login` | Connect GitHub. Creates `~/.spawn` state repo. Runs once. |
| `spawn auth claude login` | Authorize Claude Code. Shared across all containers. |
| `spawn auth codex login` | Authorize Codex. Shared across all containers. |
| `spawn clone <url>` | Spawn an isolated container for any GitHub issue, PR, or branch. |
| `spawn clone <url> --auto` | Spawn, let the agent work, open PR, die. Zero babysitting. |
| `spawn clone <url> --auto=claude` | Force Claude Code as the agent. |
| `spawn clone <url> --auto=codex` | Force Codex as the agent. |
| `spawn clone <url> --ssh` | Spawn and enter. Work interactively inside the container. |
| `spawn clone <url> --mcp-playwright` | Include Chromium sidecar for browser automation. |
| `spawn open <url>` | Re-enter an existing environment. |
| `spawn list` | All live containers. What's running, what's done. |
| `spawn status` | Current environment status. |

---

## Key Stats

| | |
|---|---|
| **1** command to start | **∞** parallel tasks |
| **0** env conflicts | **2** AI agents inside |

---

## Requirements

- Docker Engine or Docker Desktop
- Docker accessible without `sudo`
- Node.js ≥ 18 and `npm`

## Development

```bash
git clone https://github.com/glazlk/spawn
cd spawn
pnpm install
pnpm run spawn --help
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

ISC

---

<p align="center">
  <code>spawn(task) → PR. always.</code>
</p>
