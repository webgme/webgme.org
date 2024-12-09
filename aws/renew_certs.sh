#!/bin/sh
# Installed using:
# https://certbot.eff.org/instructions?ws=nginx&os=pip
# Monthly upgrade: $ /opt/certbot/bin/pip install --upgrade certbot certbot-nginx

COMPOSE_YML=/home/ubuntu/webgme.org/editor/docker-compose.yml

# or whatever your webserver is
docker compose -f $COMPOSE_YML stop web

if ! certbot renew -q --nginx > /var/log/letsencrypt/renew.log 2>&1 ; then
    echo Automated renewal failed:
    cat /var/log/letsencrypt/renew.log
    nginx -s stop
    tail /var/log/letsencrypt/letsencrypt.log
    docker compose -f $COMPOSE_YML up --no-recreate -d web
    exit 1
fi

nginx -s stop
tail /var/log/letsencrypt/letsencrypt.log
# Copy over the new certs
cp /etc/letsencrypt/live/webgme.org/privkey.pem /home/ubuntu/dockershare/ssl_certs/privkey.pem
cp /etc/letsencrypt/live/webgme.org/fullchain.pem /home/ubuntu/dockershare/ssl_certs/fullchain.pem

docker compose -f $COMPOSE_YML up --no-recreate -d web
