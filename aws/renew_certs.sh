#!/bin/sh

systemctl stop nginx  # or whatever your webserver is
if ! certbot renew > /var/log/letsencrypt/renew.log 2>&1 ; then
    echo Automated renewal failed:
    cat /var/log/letsencrypt/renew.log
    systemctl start nginx
    exit 1
fi
systemctl start nginx # or whatever your webserver is
