# AWS (EC2) deployment notes

These steps describe a typical Ubuntu **24.04 LTS** EC2 host used to run the Docker stack from this repo. Adjust hostnames, paths, and instance sizes for your environment.

## Initial host setup

- Allocate an EC2 instance (size as needed) with Ubuntu 64-bit.
- Associate a public IP and open the required ports in the security group (e.g. 22, 80, 443).
- SSH in and run `sudo apt-get update && sudo apt-get -y upgrade`.
- Set `/etc/hostname` to match your DNS name.
- In `~/.profile`, set `export HOSTNAME=<your-dns-name>` if your tooling or images rely on it.
- Install [Docker](https://docs.docker.com/engine/install/ubuntu/) and [Docker Compose](https://docs.docker.com/compose/install/linux/) (plugin: `docker compose`).
- Add your user to the `docker` group: `sudo usermod -aG docker $USER` (log out and back in).

## Directories and data

```bash
mkdir -p ~/dockershare/db ~/dockershare/ssl_certs
```

The MongoDB container persists data under `~/dockershare/db` (see [`editor/docker-compose.yml`](../editor/docker-compose.yml)). The WebGME container maps `~/dockershare` to `/dockershare` for blobs, JWT keys, and optional `extraconfigs.js`.

## Backups

[`backup.sh`](backup.sh) stops the WebGME service, runs `mongodump`, writes a compressed archive under `BACKUP_DIR`, and prunes older archives so only the **12 newest** backups are kept. In production, this script is scheduled to run **once a month**, which corresponds to roughly **a year** of retained database backups (12 monthly snapshots). Edit paths in the script (`COMPOSE_YML`, `BACKUP_DIR`, etc.) before use.

## Clone and clean editor working tree

```bash
git clone https://github.com/webgme/webgme.org.git
cd webgme.org
```

Before a fresh deploy from git, you may remove untracked files under `editor/` (only after backing up anything you need, e.g. `blob-local-storage`):

```bash
cd editor
git clean -dfx
```

## Extension registry cron

If you use [`www/updateextensions.js`](../www/updateextensions.js), schedule it with the Node binary you use in production, for example:

```cron
*/20 * * * * /home/ubuntu/.nvm/versions/node/v22.0.0/bin/node /home/ubuntu/webgme.org/www/updateextensions.js
```

Replace the Node path with `$(which node)` from your environment.

## JWT keys for authentication

Json Web Token signing uses RSA keys under `~/dockershare/token_keys` (see [`editor/config/config.docker.js`](../editor/config/config.docker.js)). The docker config can generate keys on first run if they are missing; for production you may prefer to create them explicitly:

```bash
mkdir -p ~/dockershare/token_keys
cd ~/dockershare/token_keys
openssl genrsa -out private_key 1024
openssl rsa -in private_key -pubout > public_key
```

## Updates

From `webgme.org/editor`, run [`update.sh`](https://github.com/webgme/webgme.org/blob/master/editor/update.sh) to rebuild the WebGME server image (see the script header for version/branch options).

## Nginx and TLS on the host

The Docker `web` service uses [`editor/nginx.conf`](../editor/nginx.conf) inside the container. On the host you may still install nginx and [Certbot](https://certbot.eff.org/) for Let’s Encrypt, then copy certificates into `~/dockershare/ssl_certs` as required by your process. [`renew_certs.sh`](renew_certs.sh) is an example that stops the `web` container, renews certs, copies PEM files into `dockershare`, and starts the container again—**edit paths** (`COMPOSE_YML`, cert paths) before use.

## User management

```bash
docker exec -it webgme bash
node node_modules/webgme/src/bin/usermanager.js useradd --canCreate username email password
node node_modules/webgme/src/bin/usermanager.js usermod_auth -a r username SignalFlowSystem
```

Exit the shell with Ctrl+D.

### Inspect MongoDB

With `mongo` or `mongosh` pointed at the host’s exposed `27017` port (if enabled in Compose):

```javascript
show dbs
use webgme
db.getCollection('_users')
db.getCollection('_organizations')
db.getCollection('_users').findOne()
```
