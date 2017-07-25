#!/bin/bash
# Builds docker image and launches new container for webgme-org
# This script does not remove the stopped containers or images.
# Remove all stopped containers:
# $ docker rm $(docker ps --filter "status=exited" -q)
# List images
# $ docker images
# Remove images
# $ docker rmi cc34 5703
# Usage:
#
# - Installs the latest webgme release from npm registry 
#     $ ./update.sh 
# - Installs a specific webgme release from npm registry if found
#     $ ./update.sh 0.7.0
# - Installs a specific branch from github if found
#     $ ./update.sh master
#     $ ./update.sh v0.7.x
# - Installs a specific annotated tag from github if found
#     $ ./update.sh v0.7.0
# - Installs from github given a hash
#     $ ./update.sh ccfcaffa853d9f552ac3d5ac8c01b8ba2c13e2cb
#     $ ./update.sh ccfcaff
# - Otherwise the script will fail
#set -ex
readonly POST_FIX="-org"
webgme_repo=webgme@latest
webgme_version=1.0.0

if [ -z "$1" ]; then
  echo "No argument given will use latest"
  webgme_version=$(npm show webgme version)
  echo "Latest version ${webgme_version}"
  webgme_repo=webgme@${webgme_version}
else
  # is it a valid webgme release version number
  release_match="$(npm view webgme versions | grep "'$1'")"
  if ! [ -z "${release_match}" ]; then
    echo "Found webgme release in npm registry: $1"
    webgme_version=$1
    webgme_repo=webgme@${webgme_version}
  else
    echo "Given input not in npm registry, checking for branch at github.."
    # trying to use it as a branch or tag or hash
    branch_or_tag="$1"

    commit_hash="$(git ls-remote git://github.com/webgme/webgme.git refs/heads/$branch_or_tag | cut -f 1)"
    echo "commit_hash ${commit_hash}"
    if [ -n "$commit_hash" ]; then
      echo "Branch name was given: $branch_or_tag commit hash $commit_hash"
    else
      # find annotated tag
      commit_hash="$(git ls-remote git://github.com/webgme/webgme.git refs/tags/$branch_or_tag^{} | cut -f 1)"
      if [ -n "$commit_hash" ]; then
        echo "Tag was found: $branch_or_tag commit hash $commit_hash"
      else
        commit_hash="$branch_or_tag"
        echo "Using $branch_or_tag as a commit hash"
      fi
    fi
    webgme_version=${commit_hash}
    webgme_repo=https://github.com/webgme/webgme/tarball/${commit_hash}
  fi
fi

readonly IMAGE_NAME="webgme${POST_FIX}:${webgme_version}"
readonly IMAGE_FILE="webgme${POST_FIX}_${webgme_version}.tar"
readonly TIME_STAMP=$(date +%Y_%m_%d_%H_%M_%S)
readonly CONTAINER_NAME="webgme${POST_FIX}_${webgme_version}_$TIME_STAMP"
readonly EXISTING_IMAGE=$(docker images ${IMAGE_NAME} -q)
readonly RUNNING_CONTAINER=$(docker ps -f name="webgme${POST_FIX}" -q)

if [ -z "${EXISTING_IMAGE}" ]; then
  echo "Image ${IMAGE_NAME} did not exist"
  docker build -t ${IMAGE_NAME} --build-arg webgme_repo=${webgme_repo} .
else
  echo "Image ${IMAGE_NAME} existed"
fi

## Make sure there is an image at this point
if [ -z "$(docker images ${IMAGE_NAME} -q)" ]; then
  echo "Image did not get built..."
  exit 2
fi

## The requested image is loaded - stop any running containers
if [ -z "${RUNNING_CONTAINER}" ]; then
  echo "No webgme container running"
else
  docker stop ${RUNNING_CONTAINER}
  sleep 4
fi

docker run -d -p 8001:8001 -v ~/dockershare:/dockershare --link mongo:mongo --name=${CONTAINER_NAME} --restart unless-stopped ${IMAGE_NAME}

sleep 2

docker ps -a

sleep 2

docker logs ${CONTAINER_NAME}
