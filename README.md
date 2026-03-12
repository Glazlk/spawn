# docker-git

`docker-git` создаёт отдельную Docker-среду для каждого репозитория, issue или PR.
По умолчанию проекты лежат в `~/.docker-git`.

## Что нужно

- Docker Engine или Docker Desktop
- Доступ к Docker без `sudo`
- Node.js и `npm`

## Установка

```bash
npm i -g @prover-coder-ai/docker-git
docker-git --help
```

Из этого репозитория:

```bash
pnpm install
pnpm run docker-git --help
```

## Авторизация

```bash
pnpm run docker-git auth github login --web
pnpm run docker-git auth codex login --web
pnpm run docker-git auth claude login --web
```

## Пример

```bash
docker-git clone https://github.com/agiens/crm/tree/vova-fork --force --mcp-playwright
```

## Подробности

`docker-git --help`
