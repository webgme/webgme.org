Setup instructions on AWS EC2 machines
======================================

 * Allocate new EC2 instance (e.g. t1.medium) with a Ubuntu 64-bit image
 * Associate public IP and set firewall rules (Security Group) for service ports
 * Log-in via SSH and
 * Run `sudo apt-get update && sudo apt-get -y upgrade`
 * Tweak `/etc/hostname` (reflect your choice of DNS name)
 * Tweak `.ssh/authorized_keys`
 * Run `sudo apt-get -y install git build-essential curl mongodb`
 * Copy (overwrite) 'mongodb.conf' to '/etc/mongodb.conf' and restart mongodb (`sudo restart mongodb`)
 * Run `curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -`
 * Run `sudo  apt-get install -y nodejs`
 * Clone the webgme-deployment project to the home folder (or whatever, just update `/etc/init/webgme.conf` later):
     ```git clone https://github.com/webgme/webgme-deployment.git```
 * Optional: database migration
 * Optional: update config.js to your liking 
 * Run `update.sh` in this folder 

Update instructions on AWS EC2 machines
========================================
 * Run `update.sh` in this folder  (you might want to change webgme dependency in package.json)

webgme.org (editor) website specific instructions
==================================================
 * Install nginx: `sudo apt-get -y install nginx`
 * Copy `nginx.conf` to `/etc/nginx/sites-available/default`:
    ```sudo cp nginx.conf /etc/nginx/sites-available/default```
 * Restart nginx:
    ```sudo /etc/init.d/nginx restart```
 * Make sure, that config.js was customized to use internal port (8001)

User management
===============

- `cd ~/webgme-deployment/aws`
- `node node_modules/webgme/src/bin/usermanager.js useradd --canCreate username email pass`
- `node node_modules/webgme/src/bin/usermanager.js usermod_auth -a r username SignalFlowSystem` default project

To check the mongo database collections use run `mongo`

```javascript
show dbs
use webgme
db.getCollection('_users')
db.getCollection('_organizations')

db.getCollection('_users').findOne() // finds one user
```
