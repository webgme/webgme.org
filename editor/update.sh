#!/bin/bash
# Builds docker image and launches new container for webgme-server
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
readonly POST_FIX="-server"
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
    webgme_version=${commit_hash:0:7}
    webgme_repo=https://github.com/webgme/webgme/tarball/${commit_hash}
  fi
fi

readonly SERVICE_NAME="webgme${POST_FIX}"

if [ -z "docker-compose stop ${SERVICE_NAME}" ]; then
  echo "Did not stop service ${SERVICE_NAME} is it still running?"
  echo docker-compose ps ${SERVICE_NAME}
fi

## Always build a new image
docker-compose build --no-cache --build-arg webgme_repo=${webgme_repo} ${SERVICE_NAME}

docker-compose up -d ${SERVICE_NAME}

sleep 2

docker-compose ps

sleep 2

docker-compose logs ${SERVICE_NAME}
