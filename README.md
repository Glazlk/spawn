<p align="center">
  <img src="https://raw.githubusercontent.com/glazlk/spawn/main/logo.svg" width="140" alt="spawn" />
</p>

<h1 align="center">spawn</h1>

<p align="center">
  <strong>Disposable Docker dev environments with AI agents inside.</strong><br/>
  One command. One container per task. PR opens itself.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@spawn-dev/spawn"><img src="https://img.shields.io/npm/v/@spawn-dev/spawn?color=E8521A&labelColor=0D0C0A&label=npm&style=flat-square" alt="npm" /></a>
  <a href="https://github.com/glazlk/spawn/blob/main/LICENSE"><img src="https://img.shields.io/github/license/glazlk/spawn?color=E8521A&labelColor=0D0C0A&style=flat-square" alt="license" /></a>
  <a href="https://github.com/glazlk/spawn/stargazers"><img src="https://img.shields.io/github/stars/glazlk/spawn?color=E8521A&labelColor=0D0C0A&style=flat-square" alt="stars" /></a>
  <a href="https://github.com/glazlk/spawn/issues"><img src="https://img.shields.io/github/issues/glazlk/spawn?color=E8521A&labelColor=0D0C0A&style=flat-square" alt="issues" /></a>
</p>

<p align="center">
  <a href="#quickstart">Quickstart</a> · <a href="#how-it-works">How It Works</a> · <a href="#commands">Commands</a> · <a href="#features">Features</a>
</p>

---

- ⚡ **One command** — paste a GitHub issue URL, get an isolated dev environment
- 🤖 **AI agents inside** — Claude Code and Codex pre-installed, read the issue, write code, open PR
- 🐳 **Disposable containers** — fresh environment per task, zero drift, self-destructs after PR
- 🔑 **Auth once, use everywhere** — credentials sync via private `~/.spawn` repo across machines
- 🧪 **Playwright MCP** — optional Chromium sidecar for browser automation via MCP protocol
- 🔄 **Session backup** — AI session logs auto-upload to a private Gist, linked in PR comments

---

## Quickstart

```bash
npm i -g @spawn-dev/spawn
```

<details>
<summary>Other install methods</summary>

```bash
# npx (no install)
npx @spawn-dev/spawn --help

# pnpm
pnpm add -g @spawn-dev/spawn
```

</details>

Authenticate once:

```bash
spawn auth github login --web     # GitHub (required)
spawn auth claude login --web     # Claude Code
spawn auth codex login --web      # Codex
```

Spawn your first task:

```bash
spawn clone https://github.com/org/repo/issues/42 --auto
```

The agent reads the issue, writes code, runs tests, opens a PR, and the container self-destructs. Done.

---

## How It Works

```
  AUTH          CLONE          WORK          SHIP          DIE
   │              │              │             │             │
   ▼              ▼              ▼             ▼             ▼
 Connect       Paste URL     Agent reads   Commits,      Container
 GitHub +      → isolated    issue, codes  pushes, PR    destroyed.
 AI keys       container     & runs tests  auto-opens    No state.
 (once)        (< 90s)       (--auto)      + gist log    Clean.
```

**Interactive mode** — drop `--auto`, add `--ssh` to enter the container and work yourself:

```bash
spawn clone https://github.com/org/repo/issues/42 --ssh
```

---

## Commands

### Core Workflow

```bash
# Spawn environment for any GitHub issue, PR, branch, or repo
spawn clone <url>

# Auto mode — agent works autonomously, opens PR, container dies
spawn clone <url> --auto

# Force specific agent
spawn clone <url> --auto=claude
spawn clone <url> --auto=codex

# Interactive SSH into the container
spawn clone <url> --ssh

# Re-open an existing environment
spawn open <url>

# Interactive TUI menu (default when no args)
spawn menu
```

### Auth Management

```bash
spawn auth github login --web        # OAuth web flow
spawn auth github login --token PAT  # Personal access token
spawn auth claude login --web        # Claude Code OAuth
spawn auth codex login --web         # Codex auth
spawn auth github status             # Check auth status
spawn auth github logout             # Remove credentials

# Multi-account support
spawn auth github login --label work --web
spawn auth github login --label personal --token ghp_...
spawn clone <url> --git-token work
```

### Environment Management

```bash
# Show all spawn containers and their status
spawn ps

# Stop all running containers
spawn down-all

# List tmux panes inside a project
spawn panes <url>

# List/kill/tail terminal sessions inside a container
spawn sessions list <url>
spawn sessions kill <pid> <url>
spawn sessions logs <pid> <url> --lines 500
```

### State Sync (across machines)

```bash
# Print current projects root (~/.spawn)
spawn state path

# Bind state dir to a private git repo
spawn state init --repo-url https://github.com/you/spawn-state -b main

# Sync state (commit + rebase + push)
spawn state sync -m "update from laptop"

# Manual operations
spawn state status
spawn state pull
spawn state commit -m "save auth"
spawn state push
```

### Advanced

```bash
# Generate environment without cloning (repo URL optional)
spawn create --repo-url https://github.com/org/repo

# Apply spawn config to existing project directory
spawn apply

# Enable Playwright + Chromium sidecar for an existing project
spawn mcp-playwright <url>

# Export/import session snapshots
spawn scrap export <url>
spawn scrap import <url> --archive ./snapshot
```

### Key Options

| Flag | Description |
|:-----|:-----------|
| `--auto[=claude\|codex]` | Agent works autonomously; picks by available auth if no value |
| `--ssh` | Enter the container interactively via SSH |
| `--mcp-playwright` | Enable Playwright MCP + Chromium browser sidecar |
| `--force` | Wipe existing environment and recreate from scratch |
| `--force-env` | Reset project env defaults only (keep workspace data) |
| `--repo-ref <ref>`, `-b <ref>` | Git branch/ref (default: `main`) |
| `--cpu <value>` | CPU limit: `30%` or `1.5` cores (default: `30%`) |
| `--ram <value>` | RAM limit: `30%`, `512m`, `4g` (default: `30%`) |
| `--network-mode <mode>` | `shared` or `project` network (default: `shared`) |
| `--git-token <label>` | Use named GitHub token for multi-account setups |
| `--out-dir <path>` | Custom output directory for the project |

---

## Features

### Parallel Isolation

Run issue-42 and issue-43 simultaneously. Separate containers, separate agents, zero interference. Shared package cache (pnpm/npm/yarn) keeps installs fast.

### Two AI Agents

Claude Code and Codex pre-installed in every container. `AGENTS.md` auto-loaded with issue context. In `--auto` mode the agent reads the task, writes implementation, runs tests, and opens a PR.

### Shared Credentials

One auth config for all containers. Multi-account support via `--label`. Each project keeps its own session state while sharing the login. Credentials stored in `~/.spawn` and optionally synced to a private GitHub repo.

### Session Backup

On every `git push` inside a container, AI session logs auto-upload to a private GitHub Gist. A link lands in the PR comment — full audit trail of what the agent did.

### Cloud State

`spawn state sync` backs up your `~/.spawn` directory to a private GitHub repo. Switch machines, run `spawn state pull`, and everything is restored.

### Playwright MCP

Optional Chromium sidecar via `--mcp-playwright`. Claude Code gets full browser automation through MCP protocol — navigate pages, click buttons, fill forms, take screenshots.

### Container Runtime Env

Fine-tune behavior via `.orch/env/project.env`:

```bash
CODEX_SHARE_AUTH=1                        # Share Codex auth across projects
CODEX_AUTO_UPDATE=1                       # Auto-update Codex on start
CLAUDE_AUTO_SYSTEM_PROMPT=1               # Auto-attach system prompt to Claude
SPAWN_ZSH_AUTOSUGGEST=1                  # Enable zsh-autosuggestions
MCP_PLAYWRIGHT_ISOLATED=1                 # Isolated browser contexts
```

---

## Requirements

- Docker Engine or Docker Desktop
- Docker accessible without `sudo`
- Node.js >= 18

## Development

```bash
git clone https://github.com/glazlk/spawn
cd spawn
pnpm install
pnpm run spawn --help
pnpm test
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

ISC
