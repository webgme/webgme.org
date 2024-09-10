#!/bin/sh
COMPOSE_YML=/home/ubuntu/webgme.org/editor/docker-compose.yml

# or whatever your webserver is
docker-compose -f $COMPOSE_YML stop web

if ! certbot renew > /var/log/letsencrypt/renew.log 2>&1 ; then
    echo Automated renewal failed:
    cat /var/log/letsencrypt/renew.log
    tail /var/log/letsencrypt/letsencrypt.log
    docker-compose -f $COMPOSE_YML up --no-recreate -d web
    exit 1
fi

tail /var/log/letsencrypt/letsencrypt.log
# Copy over the new certs
cp /etc/letsencrypt/live/${HOSTNAME}/privkey.pem /home/ubuntu/dockershare/ssl_certs/privkey.pem
cp /etc/letsencrypt/live/${HOSTNAME}/fullchain.pem /home/ubuntu/dockershare/ssl_certs/fullchain.pem

docker-compose -f $COMPOSE_YML up --no-recreate -d web
