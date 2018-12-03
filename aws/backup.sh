#!/bin/bash
PREFIX=$HOSTNAME
DB_NAME=webgme
SERVICE_NAME=webgme-server
COMPOSE_YML=/home/ubuntu/webgme.org/editor/docker-compose.yml

time_stamp=$(date +%Y%m%d_%H%M%S)
folder_name=/home/ubuntu/${PREFIX}_${time_stamp}
zip_file=${PREFIX}_${time_stamp}.tar.gz
zip_path=/home/ubuntu/${PREFIX}_${time_stamp}.tar.gz

mkdir $folder_name

docker-compose -f $COMPOSE_YML stop $SERVICE_NAME

mongodump -d ${DB_NAME} -o $folder_name
tar -cvzf $zip_path $folder_name
rm -rf $folder_name

docker-compose -f $COMPOSE_YML up --no-recreate -d $SERVICE_NAME

scp $zip_path ubuntu@zsolt-ws.isis.vanderbilt.edu:~/share/Archives/${zip_file}

if [ $? -eq 0 ]
then
  echo "Success! cleaning up.."
  rm $zip_path
  exit 0
else
  echo "Could not move back-up. Manually move ${zip_path} "
  exit 1
fi
