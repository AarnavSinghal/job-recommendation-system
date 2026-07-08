# Installation Guide

## Prerequisites
- Docker Desktop (macOS/Windows) or Docker Engine + compose plugin (Linux)
- Git

No other software is needed — Python, Node.js and all dependencies are
installed inside the containers automatically.

## Steps

1. Clone the repository:
```bash
   git clone https://github.com/AarnavSinghal/job-recommendation-system.git
   cd job-recommendation-system
```

2. Build and start all containers:
```bash
   docker compose up --build
```
   The first build downloads base images and installs dependencies
   (a few minutes). Subsequent starts are much faster.

3. Open the application:
   - App: http://localhost:3000
   - API documentation (Swagger): http://localhost:8000/docs

## Stopping

Press `Ctrl+C` in the terminal, then run:
```bash
docker compose down
```

## Troubleshooting

- **"port is already allocated"** — another process is using port 3000
  or 8000. Stop it, or stop other Docker projects with `docker ps` and
  `docker stop <name>`.
- **First search takes ~30 seconds** — this is normal: the salary
  prediction model trains when first used. Later searches are instant.
- **Frontend says it cannot reach the backend** — check the backend
  container is running with `docker compose ps` and inspect its logs
  with `docker compose logs backend`.