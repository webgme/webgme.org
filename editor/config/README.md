# Configuration

Overwrite or extend the [default WebGME configuration](https://github.com/webgme/webgme/blob/main/config/config.default.js) in `config.default.js`.

When adding your own paths, use `__dirname` or paths relative to this repository root so they resolve correctly on all platforms.

Set `NODE_ENV` to choose which file is loaded (e.g. `NODE_ENV=docker` loads `config.docker.js`; on Windows, `set NODE_ENV=docker`). The Docker Compose stack sets `NODE_ENV=docker` for the WebGME container.

For Docker deployments, optional overrides can also live in `/dockershare/extraconfigs.js` on the host (see `config.docker.js` and `../../aws/extraconfigs.js`).
