#!/bin/sh
COMPOSE_YML=/home/ubuntu/webgme.org/editor/docker-compose.yml

# or whatever your webserver is
/usr/local/bin/docker-compose -f $COMPOSE_YML stop web

if ! certbot renew > /var/log/letsencrypt/renew.log 2>&1 ; then
    echo Automated renewal failed:
    cat /var/log/letsencrypt/renew.log
    systemctl stop nginx
    tail /var/log/letsencrypt/letsencrypt.log
    /usr/local/bin/docker-compose -f $COMPOSE_YML up --no-recreate -d web
    exit 1
fi

systemctl stop nginx
tail /var/log/letsencrypt/letsencrypt.log
# Copy over the new certs
cp /etc/letsencrypt/live/${HOSTNAME}/privkey.pem /home/ubuntu/dockershare/ssl_certs/privkey.pem
cp /etc/letsencrypt/live/${HOSTNAME}/fullchain.pem /home/ubuntu/dockershare/ssl_certs/fullchain.pem

/usr/local/bin/docker-compose -f $COMPOSE_YML up --no-recreate -d web
