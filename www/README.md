# WebGME marketing site (`www/`)

Static assets and a small Node server used for [webgme.org](https://webgme.org).

The Docker setup in [`editor/docker-compose.yml`](../editor/docker-compose.yml) mounts `www/static` into the nginx `web` container so the public site and the editor share one stack when deployed that way.

## Update `extensions.json`

Queries the npm registry for packages tagged with `webgme` and refreshes extension metadata. See the [Publish Extensions](https://github.com/webgme/webgme/wiki/Publish-Extensions) wiki page for how extensions are categorized.

```bash
cd www
node ./updateextensions.js
```

### Cron (production)

Run on a schedule if you want the extension list kept fresh (adjust paths to match your server):

```cron
*/20 * * * * /usr/bin/node /path/to/webgme.org/www/updateextensions.js
```

Use `which node` (or your nvm Node binary) for the interpreter path.

## Run the Node server locally

Install dependencies, then start the app from **this directory** (`www/`):

```bash
cd www
npm install
node server.js
```

Configuration is read from `config.json` in the **parent** of `www` (repository root). Defaults bind to `127.0.0.1:8000` unless overridden there.
