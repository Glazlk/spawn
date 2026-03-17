import type { TemplateConfig } from "../domain.js"

const entrypointDockerGitBootstrapTemplate = String
  .raw`# Bootstrap ~/.spawn for nested spawn usage inside this container.
SPAWN_HOME="/home/__SSH_USER__/.spawn"
SPAWN_AUTH_DIR="$SPAWN_HOME/.orch/auth/codex"
SPAWN_ENV_DIR="$SPAWN_HOME/.orch/env"
SPAWN_ENV_GLOBAL="$SPAWN_ENV_DIR/global.env"
SPAWN_ENV_PROJECT="$SPAWN_ENV_DIR/project.env"
SPAWN_AUTH_KEYS="$SPAWN_HOME/authorized_keys"

mkdir -p "$SPAWN_AUTH_DIR" "$SPAWN_ENV_DIR" "$SPAWN_HOME/.orch/auth/gh"

if [[ -f "/home/__SSH_USER__/.ssh/authorized_keys" ]]; then
  cp "/home/__SSH_USER__/.ssh/authorized_keys" "$SPAWN_AUTH_KEYS"
elif [[ -f /authorized_keys ]]; then
  cp /authorized_keys "$SPAWN_AUTH_KEYS"
fi
if [[ -f "$SPAWN_AUTH_KEYS" ]]; then
  chmod 600 "$SPAWN_AUTH_KEYS" || true
fi

if [[ ! -f "$SPAWN_ENV_GLOBAL" ]]; then
  cat <<'EOF' > "$SPAWN_ENV_GLOBAL"
# spawn env
# KEY=value
EOF
fi
if [[ ! -f "$SPAWN_ENV_PROJECT" ]]; then
  cat <<'EOF' > "$SPAWN_ENV_PROJECT"
# spawn project env defaults
CODEX_SHARE_AUTH=1
CODEX_AUTO_UPDATE=1
SPAWN_ZSH_AUTOSUGGEST=1
SPAWN_ZSH_AUTOSUGGEST_STYLE=fg=8,italic
SPAWN_ZSH_AUTOSUGGEST_STRATEGY=history completion
MCP_PLAYWRIGHT_ISOLATED=1
EOF
fi

upsert_env_var() {
  local file="$1"
  local key="$2"
  local value="$3"
  local tmp
  tmp="$(mktemp)"
  awk -v key="$key" 'index($0, key "=") != 1 { print }' "$file" > "$tmp"
  printf "%s=%s\n" "$key" "$value" >> "$tmp"
  mv "$tmp" "$file"
}

copy_if_distinct_file() {
  local source="$1"
  local target="$2"
  if [[ ! -f "$source" ]]; then
    return 1
  fi
  local source_real=""
  local target_real=""
  source_real="$(readlink -f "$source" 2>/dev/null || true)"
  target_real="$(readlink -f "$target" 2>/dev/null || true)"
  if [[ -n "$source_real" && -n "$target_real" && "$source_real" == "$target_real" ]]; then
    return 0
  fi
  cp "$source" "$target"
  return 0
}

if [[ -n "$GH_TOKEN" ]]; then
  upsert_env_var "$SPAWN_ENV_GLOBAL" "GH_TOKEN" "$GH_TOKEN"
fi
if [[ -n "$GITHUB_TOKEN" ]]; then
  upsert_env_var "$SPAWN_ENV_GLOBAL" "GITHUB_TOKEN" "$GITHUB_TOKEN"
elif [[ -n "$GH_TOKEN" ]]; then
  upsert_env_var "$SPAWN_ENV_GLOBAL" "GITHUB_TOKEN" "$GH_TOKEN"
fi

SOURCE_CODEX_CONFIG="__CODEX_HOME__/config.toml"
copy_if_distinct_file "$SOURCE_CODEX_CONFIG" "$SPAWN_AUTH_DIR/config.toml" || true

SOURCE_SHARED_AUTH="__CODEX_HOME__-shared/auth.json"
SOURCE_LOCAL_AUTH="__CODEX_HOME__/auth.json"
if [[ -f "$SOURCE_SHARED_AUTH" ]]; then
  copy_if_distinct_file "$SOURCE_SHARED_AUTH" "$SPAWN_AUTH_DIR/auth.json" || true
elif [[ -f "$SOURCE_LOCAL_AUTH" ]]; then
  copy_if_distinct_file "$SOURCE_LOCAL_AUTH" "$SPAWN_AUTH_DIR/auth.json" || true
fi
if [[ -f "$SPAWN_AUTH_DIR/auth.json" ]]; then
  chmod 600 "$SPAWN_AUTH_DIR/auth.json" || true
fi

chown -R 1000:1000 "$SPAWN_HOME" || true`

export const renderEntrypointDockerGitBootstrap = (config: TemplateConfig): string =>
  entrypointDockerGitBootstrapTemplate
    .replaceAll("__SSH_USER__", config.sshUser)
    .replaceAll("__CODEX_HOME__", config.codexHome)
