Setup instructions on AWS EC2 machines
======================================

 * Allocate new EC2 instance (e.g. t1.medium) with a Ubuntu 64-bit image
 * Associate public IP and set firewall rules (Security Group) for service ports
 * Log-in via SSH and
 * Run `sudo apt-get update && sudo apt-get -y upgrade`
 * Tweak `/etc/hostname` (reflect your choice of DNS name)
 * Tweak `.ssh/authorized_keys`
 * Install [docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04)
 * Add current user to docker group `sudo usermod -aG docker $USER`
 * `mkdir ~/dockershare`
 * `mkdir ~/dockershare/db`
 * `docker run -d -p 27017:27017 -v ~/dockershare/db:/data/db -v ~/webgme.org/aws/mongodb.conf:/etc/mongo.conf --name mongo --restart unless-stopped mongo`
 * Install but do not start the daemon! [mongodb 3.2](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-16-04)
 * The mongo container exposes its port at default so `mongo`, `mongodump`, etc. works the same way.
 * Clone the webgme-deployment project to the home folder.
     ```git clone https://github.com/webgme/webgme-deployment.git```
 * Remove all unversioned files inside editor (MAKE SURE YOU'VE copied the blob-local-storage if migrating see below)
 * `git clean -dfx`
 * Run `editor/update.sh`.
 * Install [nvm/node](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04#how-to-install-using-nvm)
 * Add to crontab (check `whereis node`)
 ```
 */20 * * * * /home/ubuntu/.nvm/versions/node/v6.11.1/bin/node /home/ubuntu/webgme.org/www/updateextensions.js
 ```

Upgrading from Ubuntu 14.04
========================================
 * Make sure to export any old db files `mongodump -d webgme`
 * `cp -R blob-local-storage ~/dockershare/blob-local-storage`
 * `cp -R token_keys ~/dockershare/token_keys` (If no previous keys see Authentication below)
 * Remove the [old mongodb installation 2.6](https://askubuntu.com/questions/497139/how-to-completely-uninstall-mongodb-2-6-3-from-ubuntu-13-04)
 * Once mongod > 3 is installed and docker container running - import the exported files (if any) `mongorestore -d webgme dump/webgme`


Authentication
========================================
 The authentication scheme for Json Web Token uses OpenSSL RSA256 keys. They should live outside of the docker container.
 - `mkdir ~/dockershare/token_keys`
 - `cd ~/dockershare/token_keys`
 - `openssl genrsa -out private_key 1024`
 - `openssl rsa -in private_key -pubout > public_key`

Update instructions on AWS EC2 machines
========================================
 * Run `editor/update.sh`, see the header of [update.sh](https://github.com/webgme/webgme.org/blob/master/editor/update.sh) for more details.

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
 * Generate the certificates (prefix with `dev` if dev machine)
 ```
sudo cerbot --nginx certonly --cert-name webgme.org -d webgme.org editor.webgme.org
 ```
 * Copy the `nginx.conf` to `/etc/nginx`:
    ```sudo cp nginx.conf /etc/nginx/nginx.conf```
 * Restart nginx:
    ```sudo systemctl restart nginx```

### If 403 issues
 * Make sure the the nginx user owns `ls -l /var/lib/nginx` and all sub-dirs.
 * To check user `ps aux | grep nginx` and check for the worker_process
 * If wrong owner do: `chown -R nginx:nginx /var/lib/nginx` or `chown -R nobody:root /var/lib/nginx`

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
