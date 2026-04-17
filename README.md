# webgme.org

This repository holds deployment assets and the public website for [WebGME](https://webgme.org).

| Path | Purpose |
|------|---------|
| [`editor/`](editor/) | Docker Compose stack: WebGME app, MongoDB, and nginx (HTTPS + reverse proxy). |
| [`www/`](www/) | Static site and tooling used for [webgme.org](https://webgme.org) (e.g. extension registry updates). |
| [`aws/`](aws/) | AWS-oriented helpers (cert renewal, backups, sample `extraconfigs.js`). See [`aws/README.md`](aws/README.md). |

---

## Run the editor with Docker

Prerequisites: [Docker](https://docs.docker.com/get-docker/) with [Compose](https://docs.docker.com/compose/) (`docker compose`).

1. **Shared host directory** (mounted as `/dockershare` in the WebGME container), e.g.:

   ```bash
   mkdir -p ~/dockershare/db ~/dockershare/ssl_certs
   ```

2. **TLS certificates** for nginx HTTPS: place `privkey.pem` and `fullchain.pem` under `~/dockershare/ssl_certs/`. For local development you can use self-signed certs or adjust [`editor/nginx.conf`](editor/nginx.conf) (e.g. `server_name`, listeners) to match how you reach the stack.

3. **Static site volume**: [`editor/docker-compose.yml`](editor/docker-compose.yml) mounts the marketing site at `~/webgme.org/www/static` into the `web` service. If your clone lives elsewhere, edit that path to point at this repo’s `www/static` directory.

4. **Start the stack** from the `editor` directory:

   ```bash
   cd editor
   docker compose up -d --build
   ```

   The first run builds images from [`editor/Dockerfile`](editor/Dockerfile) (WebGME from npm, default `webgme@latest`) and [`editor/Dockerfile.nginx.webgme.org`](editor/Dockerfile.nginx.webgme.org). The `web` service exposes **80** and **443** on the host; the WebGME process listens on **8001** inside the Docker network and is reached via nginx (see [`editor/nginx.conf`](editor/nginx.conf)).

### Optional: admin user on first boot

Set `GME_ADMIN` to `username:password` (e.g. `admin:admin`) in the `webgme-server` service environment in `docker-compose.yml` or via your orchestrator. After login, change the password at `/profile/login` on your editor URL.

### Extra WebGME configuration

To override settings, add `~/dockershare/extraconfigs.js` exporting a function `(config) => { ... }`. See [`aws/extraconfigs.js`](aws/extraconfigs.js) for shape and [`editor/config/config.docker.js`](editor/config/config.docker.js) for how it is loaded. Restart the `webgme-server` container after changes.

### Production notes

WebGME is normally run behind a reverse proxy with TLS. The in-repo example is [`editor/nginx.conf`](editor/nginx.conf). For pinning a specific WebGME version when building the image, use the `webgme_repo` build argument in `editor/Dockerfile` or use [`editor/update.sh`](editor/update.sh) on a server deployment (see [`aws/README.md`](aws/README.md)). Release versions are listed on [GitHub releases](https://github.com/webgme/webgme/releases).
