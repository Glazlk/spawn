# TASK: Rebrand `docker-git` → `spawn`

> **Agent:** This is a complete rebrand task. Read it fully before touching a single file.
> **Repo:** You are working inside the cloned `docker-git` repository on a new account.
> **Goal:** Transform every trace of the old brand into the new brand. Zero leftovers.

---

## 1. Brand Identity — The Source of Truth

### Name
```
spawn
```
- Always lowercase in code, CLI, config, package names
- SPAWN in uppercase only in logo, README hero, marketing contexts
- Never "Spawn" (mixed case) in technical contexts

### One-liner (GitHub description field)
```
spawn(task) → isolated env + AI agent → PR. No config. No babysitting.
```

### Tagline
```
Don't configure. Spawn.
```

### Extended slogan
```
Spawn disposable dev environments per GitHub issue. AI agents work inside while you're away.
```

### Core concept
Spawn creates one isolated Docker container per GitHub issue/PR/task.
Each container has its own AI agent (Claude Code / Codex), shared package caches,
and optional Playwright browser sidecar. `--auto` mode: agent works, opens PR, container dies.
SSH mode: enter the container and work interactively.

### Brand voice
- Terse. Confident. No fluff.
- Technical precision without corporate softness.
- Gaming energy: spawn point, spawn swarm, respawn.
- Never "helping you", "empowering", "seamlessly".

### Key commands (preserve in docs)
```bash
spawn auth github login
spawn auth claude login
spawn clone https://github.com/org/repo/issues/42
spawn clone ... --auto
spawn clone ... --ssh
spawn open https://github.com/org/repo/issues/42
spawn list
spawn status
```

### Color palette (for README badges / shields.io)
- Primary accent: `#E8521A` (spawn orange)
- Dark background: `#080806`
- Text on dark: `#EDE8E2`
- Use in shields: `color=E8521A&labelColor=080806`

### Logo (SVG — embed directly in README)
Three cascading chevrons with decreasing opacity — represents unix fork(), gaming spawn, forward velocity.

```svg
<svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 11 L31 32 L8 53" stroke="#E8521A" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M22 11 L45 32 L22 53" stroke="#E8521A" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.38"/>
  <path d="M36 17 L54 32 L36 47" stroke="#E8521A" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.12"/>
</svg>
```

---

## 2. File & Directory Renames

### Directories
| Old | New |
|-----|-----|
| `~/.docker-git/` | `~/.spawn/` |
| `.orch/` | `.orch/` (keep — internal, not branded) |

### Package names (package.json, pnpm-workspace.yaml)
| Old | New |
|-----|-----|
| `@prover-coder-ai/docker-git` | `@spawn-dev/spawn` |
| `effect-template-workspace` | `spawn-workspace` |
| `@effect-template/lib` | `@spawn-dev/lib` |
| `@prover-coder-ai/docker-git-app` | `@spawn-dev/app` |

### Binary / CLI entry point
| Old | New |
|-----|-----|
| `docker-git` | `spawn` |
| `pnpm run docker-git` | `pnpm run spawn` |

### npm scripts in root package.json
```json
{
  "scripts": {
    "spawn": "pnpm --filter ./packages/app build:spawn && node packages/app/dist/src/spawn/main.js",
    "spawn:dev": "..."
  }
}
```

### Source file paths
```
packages/app/src/docker-git/ → packages/app/src/spawn/
packages/app/src/docker-git/main.js → packages/app/src/spawn/main.js
```

### Vite config references
```
vite.docker-git.config.ts → vite.spawn.config.ts
build:docker-git → build:spawn
```

---

## 3. String Replacements — Global Search & Replace

Run these in order. Use `grep -r` to verify zero remaining hits after each pass.

### Pass 1 — Package & binary names
```bash
# In ALL files (*.ts, *.js, *.json, *.yaml, *.yml, *.md, *.sh, *.toml)
docker-git          → spawn
docker_git          → spawn
DOCKER_GIT          → SPAWN
docker-git-shared   → spawn-shared
dg-<repo>           → spawn-<repo>
dg-<repo>-browser   → spawn-<repo>-browser
```

### Pass 2 — Paths and directories
```bash
~/.docker-git       → ~/.spawn
.docker-git         → .spawn
DOCKER_GIT_PROJECTS_ROOT  → SPAWN_PROJECTS_ROOT
CODEX_HOME/.docker-git    → CODEX_HOME/.spawn
```

### Pass 3 — Organization & repo references
```bash
ProverCoderAI/docker-git  → <new-github-username>/spawn
@prover-coder-ai          → @spawn-dev
prover-coder-ai           → spawn-dev
ProverCoderAI             → <new-github-username>
```

### Pass 4 — Env variable prefixes
```bash
DOCKER_GIT_ZSH_AUTOSUGGEST    → SPAWN_ZSH_AUTOSUGGEST
DOCKER_GIT_SKIP_SESSION_BACKUP → SPAWN_SKIP_SESSION_BACKUP
DOCKER_GIT_PROJECTS_ROOT      → SPAWN_PROJECTS_ROOT
docker-git-shared (network)   → spawn-shared
```

### Pass 5 — npm published package
```bash
@prover-coder-ai/docker-git   → @spawn-dev/spawn
```

---

## 4. Files to Update — Detailed

### `/README.md` — Full rewrite required

Structure:
```markdown
<!-- Logo hero -->
<p align="center">
  <svg width="72" height="72" ...><!-- spawn chevron logo --></svg>
</p>

<h1 align="center">spawn</h1>

<p align="center">
  <code>spawn(task) → isolated env + AI agent → PR. No config. No babysitting.</code>
</p>

<p align="center">
  <!-- shields.io badges with spawn orange -->
  <img src="https://img.shields.io/npm/v/@spawn-dev/spawn?color=E8521A&labelColor=080806&label=npm" />
  <img src="https://img.shields.io/github/license/<user>/spawn?color=E8521A&labelColor=080806" />
</p>

---

## What is spawn?

spawn creates a disposable Docker dev environment per GitHub issue, PR, or task.
Each environment has its own AI agent. Point. Spawn. Walk away.

## Quickstart

\`\`\`bash
npx @spawn-dev/spawn auth github login
npx @spawn-dev/spawn clone https://github.com/org/repo/issues/42 --auto
\`\`\`

## How it works

spawn(task) → isolated container + AI agent → opens PR → container exits.

...rest of docs with spawn terminology throughout
```

### `/package.json` (root)
- `name`: `spawn-workspace`
- `scripts`: replace all `docker-git` → `spawn`
- `description`: `"spawn(task) → isolated env + AI agent → PR"`

### `/Dockerfile`
- Update any `docker-git` path references
- Update ENV variables: `DOCKER_GIT_*` → `SPAWN_*`
- Update LABEL `org.opencontainers.image.title` = `"spawn"`

### `/entrypoint.sh`
- Replace all variable names: `DOCKER_GIT_*` → `SPAWN_*`
- Replace path `~/.docker-git` → `~/.spawn`
- Replace container name prefixes `dg-` → `spawn-`

### `/docker-compose.yml`
- Service names: `docker-git` → `spawn`
- Network name: `docker-git-shared` → `spawn-shared`
- Volume names: `docker-git-*` → `spawn-*`

### `/CLAUDE.md` and `/AGENTS.md`
- Update tool references from `docker-git` → `spawn`
- Update path references
- Update command examples

### `/.github/workflows/*.yml`
- Update all action names, step names
- Update `pnpm run docker-git` → `pnpm run spawn`
- Update package publish name to `@spawn-dev/spawn`
- Update GitHub repo references

### `/renovate.json`
- Update package name references

### `/.changeset/config.json`
- Update linked packages

### `/flake.nix`
- Update package name, description

### `/ctl`
- Update all `docker-git` references to `spawn`

---

## 5. GitHub Repository Settings

After pushing, configure via GitHub UI or `gh` CLI:

```bash
# Repository name
gh repo rename spawn

# Description
gh repo edit --description "spawn(task) → isolated env + AI agent → PR. No config. No babysitting."

# Homepage
gh repo edit --homepage "https://spawn.dev"

# Topics
gh repo edit --add-topic "developer-tools,docker,ai-agents,devenv,cli,automation,vibe-coding"

# Make public
gh repo edit --visibility public
```

---

## 6. npm Package

Update `packages/app/package.json`:
```json
{
  "name": "@spawn-dev/spawn",
  "version": "1.0.0",
  "description": "spawn(task) → isolated env + AI agent → PR. No config. No babysitting.",
  "bin": {
    "spawn": "./dist/src/spawn/main.js"
  },
  "keywords": ["spawn", "devenv", "docker", "ai-agents", "cli", "vibe-coding"]
}
```

---

## 7. New Files to Create

### `/.github/FUNDING.yml`
```yaml
github: [<username>]
```

### `/.github/ISSUE_TEMPLATE/bug_report.md`
```markdown
---
name: Bug report
about: Something broke when spawning
---

**spawn version:** 
**Command that failed:**
```bash
spawn ...
```
```

### `/CONTRIBUTING.md`
```markdown
# Contributing to spawn

## Setup
\`\`\`bash
git clone https://github.com/<user>/spawn
cd spawn
pnpm install
pnpm run spawn --help
\`\`\`
```

### `/logo.svg` (in repo root, for GitHub social preview)
Full spawn logo SVG — three chevrons on dark background, 1200×630px ratio.

---

## 8. Verification Checklist

After all changes, run these checks:

```bash
# Zero docker-git traces (excluding git history)
grep -r "docker-git" . \
  --exclude-dir=.git \
  --exclude-dir=node_modules \
  --exclude="*.lock" \
  | grep -v "# old name" \
  && echo "FAIL: docker-git traces found" || echo "PASS"

# Zero ProverCoderAI traces
grep -r "ProverCoderAI\|prover-coder-ai" . \
  --exclude-dir=.git \
  --exclude-dir=node_modules \
  | wc -l

# Build passes
pnpm install
pnpm run -r build

# Lint passes
pnpm run -r lint

# CLI works
node packages/app/dist/src/spawn/main.js --help
# Must show: "spawn" in output, not "docker-git"

# spawn binary responds
pnpm run spawn --help
```

---

## 9. Commit Convention

Use these commit messages in order:

```
chore(rebrand): rename package @prover-coder-ai/docker-git → @spawn-dev/spawn
chore(rebrand): rename CLI binary docker-git → spawn
chore(rebrand): replace all DOCKER_GIT_ env vars → SPAWN_
chore(rebrand): rename ~/.docker-git paths → ~/.spawn
chore(rebrand): rename container prefixes dg- → spawn-
chore(rebrand): update docker-compose networks and volumes
chore(rebrand): rewrite README with spawn brand
chore(rebrand): update GitHub Actions workflows
feat(brand): add spawn logo SVG and brand assets
chore(rebrand): final verification pass — zero docker-git traces
```

---

## 10. Definition of Done

- [ ] `grep -r "docker-git" . --exclude-dir=.git --exclude-dir=node_modules` returns zero hits
- [ ] `pnpm run spawn --help` shows `spawn` in output header
- [ ] `node packages/app/dist/src/spawn/main.js --version` works
- [ ] README renders correctly on GitHub with logo, badge, one-liner
- [ ] GitHub repo description = `spawn(task) → isolated env + AI agent → PR. No config. No babysitting.`
- [ ] GitHub topics set
- [ ] All CI workflows pass on new account
- [ ] npm package name updated (do NOT publish yet — confirm first)

---

> **Agent note:** If you find ambiguous cases (e.g. a variable that's both a path and a name), prefer the more specific replacement. When in doubt, grep for context before replacing. Do not modify `.git/` directory. Do not modify `pnpm-lock.yaml` manually — let `pnpm install` regenerate it after package.json changes.
