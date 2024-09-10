#!/bin/sh
# TODO: Append --delete
docker exec webgme node /usr/app/node_modules/webgme-engine/src/bin/clean_up.js --daysAgo 7 -b 99