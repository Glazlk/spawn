  #!/bin/bash
  set -euo pipefail
  cd /d/Projects/Spawn
  echo "=== SPAWN REBRAND ==="
  FILES=$(find . -type f ! -path './.git/*' ! -path '*/node_modules/*' ! -path '*/dist/*' ! -name
  'pnpm-lock.yaml' ! -name '*.lock' ! -name 'SPAWN_REBRAND_TASK.md' ! -name 'rebrand.sh' \( -name '*.ts'
  -o -name '*.js' -o -name '*.json' -o -name '*.yml' -o -name '*.yaml' -o -name '*.md' -o -name '*.sh' -o
   -name '*.toml' -o -name '*.nix' -o -name 'Dockerfile' -o -name '.gitignore' -o -name 'ctl' \))
  echo "Processing $(echo "$FILES" | wc -l) files"
  echo "$FILES" | xargs sed -i 's|@prover-coder-ai/docker-git|@spawn-dev/spawn|g' 2>/dev/null || true
  echo "$FILES" | xargs sed -i 's|ProverCoderAI/docker-git|konard/spawn|g' 2>/dev/null || true
  echo "$FILES" | xargs sed -i 's|@prover-coder-ai|@spawn-dev|g' 2>/dev/null || true
  echo "$FILES" | xargs sed -i 's|prover-coder-ai|spawn-dev|g' 2>/dev/null || true
  echo "$FILES" | xargs sed -i 's|ProverCoderAI|konard|g' 2>/dev/null || true
  echo "$FILES" | xargs sed -i 's|effect-template-workspace|spawn-workspace|g' 2>/dev/null || true
  echo "$FILES" | xargs sed -i 's|@effect-template/lib|@spawn-dev/lib|g' 2>/dev/null || true
  echo "$FILES" | xargs sed -i 's|@effect-template/api|@spawn-dev/api|g' 2>/dev/null || true
  echo "$FILES" | xargs sed -i 's|@effect-template|@spawn-dev|g' 2>/dev/null || true
  echo "$FILES" | xargs sed -i 's|DOCKER_GIT|SPAWN|g' 2>/dev/null || true
  echo "$FILES" | xargs sed -i 's|docker-git|spawn|g' 2>/dev/null || true
  echo "$FILES" | xargs sed -i 's|docker_git|spawn|g' 2>/dev/null || true
  echo "$FILES" | xargs sed -i 's|dg-\${|spawn-${|g' 2>/dev/null || true
  echo "$FILES" | xargs sed -i 's|\.docker-git|.spawn|g' 2>/dev/null || true
  echo "$FILES" | xargs sed -i 's|deleteDockerGitProject|deleteSpawnProject|g' 2>/dev/null || true
  echo "=== VERIFY ==="
  grep -rl "docker-git\|DOCKER_GIT\|docker_git" . --exclude-dir=.git --exclude-dir=node_modules
  --exclude-dir=dist --exclude='*.lock' --exclude='pnpm-lock.yaml' --exclude='SPAWN_REBRAND_TASK.md'
  --exclude='rebrand.sh' 2>/dev/null && echo "^^^ REMAINING" || echo "PASS: zero docker-git"
  grep -rl "ProverCoderAI\|prover-coder-ai" . --exclude-dir=.git --exclude-dir=node_modules
  --exclude-dir=dist --exclude='*.lock' --exclude='pnpm-lock.yaml' --exclude='SPAWN_REBRAND_TASK.md'
  --exclude='rebrand.sh' 2>/dev/null && echo "^^^ REMAINING" || echo "PASS: zero ProverCoderAI"
  grep -rl "effect-template" . --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist
  --exclude='*.lock' --exclude='pnpm-lock.yaml' --exclude='SPAWN_REBRAND_TASK.md' --exclude='rebrand.sh'
  2>/dev/null && echo "^^^ REMAINING" || echo "PASS: zero effect-template"
  echo "=== DONE ==="
  ENDOFSCRIPT
