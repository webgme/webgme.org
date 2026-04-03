#!/bin/bash
# Stops the WebGME server, dumps MongoDB to a tarball under BACKUP_DIR, keeps the 10 newest
# archives, then starts the server again.

PREFIX=$HOSTNAME
DB_NAME=webgme
SERVICE_NAME=webgme-server
COMPOSE_YML=/home/ubuntu/webgme.org/editor/docker-compose.yml
BACKUP_DIR=/home/ubuntu/backups

time_stamp=$(date +%Y%m%d_%H%M%S)
folder_name=${BACKUP_DIR}/${PREFIX}_${time_stamp}
zip_path=${BACKUP_DIR}/${PREFIX}_${time_stamp}.tar.gz

mkdir -p "$BACKUP_DIR"
mkdir "$folder_name"

# Avoid writing to the DB while dumping.
docker compose -f $COMPOSE_YML stop $SERVICE_NAME

mongodump --quiet -d ${DB_NAME} -o $folder_name
tar -czf $zip_path $folder_name
rm -rf $folder_name

# Drop oldest backups when there are more than 10 tarballs in BACKUP_DIR.
shopt -s nullglob
while true; do
  backups=("$BACKUP_DIR"/*.tar.gz)
  [[ ${#backups[@]} -le 12 ]] && break
  oldest=$(ls -1tr "$BACKUP_DIR"/*.tar.gz | head -n1)
  [[ -n "$oldest" ]] || break
  rm -f "$oldest"
done

echo "New archive: $zip_path"
echo "Backups in $BACKUP_DIR:"
ls -lah "$BACKUP_DIR"
echo "Disk usage (df -h):"
df -h

docker compose -f $COMPOSE_YML up --no-recreate -d $SERVICE_NAME
