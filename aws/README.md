Setup instructions on AWS EC2 machines (Ubuntu 24.04)
=====================================================

 * Allocate new EC2 instance (e.g. t1.medium) with a Ubuntu 64-bit image
 * Associate public IP and set firewall rules (Security Group) for service ports
 * Log-in via SSH and
 * Run `sudo apt-get update && sudo apt-get -y upgrade`
 * Tweak `/etc/hostname` (reflect your choice of DNS name)
 * In `./.profile` add the line `export HOSTNAME=<DNS name>` (needed for building correct nginx image)
 * Tweak `.ssh/authorized_keys`
 * Install [docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04)
 * Install [docker-compse](https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-18-04)
 * Add current user to docker group `sudo usermod -aG docker $USER`
 * `mkdir ~/dockershare`
 * `mkdir ~/dockershare/db`
 * `mkdir ~/dockershare/ssl_certs`
 * The mongo container exposes its port at default so `mongo`, `mongodump`, etc. works the same way.
 * Clone the webgme.org project to the home folder.
     ```git clone https://github.com/webgme/webgme.org.git```
 * Remove all unversioned files inside editor (MAKE SURE YOU'VE copied the blob-local-storage if migrating see below)
 * `git clean -dfx`
 * Inside `/editor` run
 * Install [nvm/node](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04#how-to-install-using-nvm)
 * Add to crontab (check `whereis node`)
 ```
 */20 * * * * /home/ubuntu/.nvm/versions/node/v6.11.1/bin/node /home/ubuntu/webgme.org/www/updateextensions.js
 ```

Authentication
========================================
 The authentication scheme for Json Web Token uses OpenSSL RSA256 keys. They should live outside of the docker container.
 - `mkdir ~/dockershare/token_keys`
 - `cd ~/dockershare/token_keys`
 - `openssl genrsa -out private_key 1024`
 - `openssl rsa -in private_key -pubout > public_key`

Update instructions on AWS EC2 machines
========================================
 * `cd webgme.org/editor`
 * `./update.sh`, see the header of [update.sh](https://github.com/webgme/webgme.org/blob/master/editor/update.sh) for more details.

Nginx and SSL
==================================================
 * Install nginx: `sudo apt-get -y install nginx`
 * Install [cerbot (with nginx plugin)](https://certbot.eff.org/#ubuntuxenial-nginx)
 ```
 $ sudo apt-get update
 $ sudo apt-get install software-properties-common
 $ sudo add-apt-repository ppa:certbot/certbot
 $ sudo apt-get update
 $ sudo apt-get install python-certbot-nginx
 ```
 * `./renew_certs.sh` will copy over certs

### Renew certificates
```
sudo ./renew_certs.sh
```

User management
===============

- `docker exec -it <webgme-container-name-or-id-hash> bash`
- `node node_modules/webgme/src/bin/usermanager.js useradd --canCreate username email pass`
- `node node_modules/webgme/src/bin/usermanager.js usermod_auth -a r username SignalFlowSystem` default project

To exit bash: Ctrl + D

To check the mongo database collections use run `mongo`

```javascript
show dbs
use webgme
db.getCollection('_users')
db.getCollection('_organizations')

db.getCollection('_users').findOne() // finds one user
```
