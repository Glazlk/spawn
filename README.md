<p align="center">
  <svg width="72" height="72" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 11 L31 32 L8 53" stroke="#E8521A" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M22 11 L45 32 L22 53" stroke="#E8521A" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.38"/>
    <path d="M36 17 L54 32 L36 47" stroke="#E8521A" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.12"/>
  </svg>
</p>

<h1 align="center">spawn</h1>

<p align="center">
  <code>spawn(task) → isolated env + AI agent → PR. No config. No babysitting.</code>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/@spawn-dev/spawn?color=E8521A&labelColor=080806&label=npm" alt="npm" />
  <img src="https://img.shields.io/github/license/konard/spawn?color=E8521A&labelColor=080806" alt="license" />
</p>

---

## What is spawn?

spawn creates a disposable Docker dev environment per GitHub issue, PR, or task.
Each environment has its own AI agent. Point. Spawn. Walk away.

## Quickstart

```bash
npm i -g @spawn-dev/spawn
spawn auth github login --web
spawn clone https://github.com/org/repo/issues/42 --auto
```

## How it works

`spawn(task)` → isolated container + AI agent → opens PR → container exits.

Each container has its own AI agent (Claude Code / Codex), shared package caches,
and optional Playwright browser sidecar. `--auto` mode: agent works, opens PR, container dies.
SSH mode: enter the container and work interactively.

## Auth

```bash
spawn auth github login --web
spawn auth codex login --web
spawn auth claude login --web
```

## Usage

```bash
# Clone and spawn environment for an issue
spawn clone https://github.com/org/repo/issues/42

# Auto mode — agent works autonomously
spawn clone https://github.com/org/repo/issues/42 --auto

# Force agent choice
spawn clone https://github.com/org/repo/issues/42 --auto=claude
spawn clone https://github.com/org/repo/issues/42 --auto=codex

# SSH into the container
spawn clone https://github.com/org/repo/issues/42 --ssh

# Playwright sidecar
spawn clone https://github.com/org/repo/issues/42 --mcp-playwright

# List active environments
spawn list

# Check status
spawn status
```

## Requirements

- Docker Engine or Docker Desktop
- Docker accessible without `sudo`
- Node.js and `npm`

## Development

```bash
git clone https://github.com/konard/spawn
cd spawn
pnpm install
pnpm run spawn --help
```

## License

ISC
