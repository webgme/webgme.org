#!/bin/bash
# Installs or updates webgme
#
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


sudo stop webgme

if [ -d /etc/init/ ]; then
  echo "Updating webgme.conf ..."
  sudo cp ../aws/webgme.conf /etc/init/webgme.conf
else
  echo "/etc/init/ does not exist; do not copy webgme.conf."
fi

echo "Installing all dependencies ..."
npm install

if [ -z "$1" ]; then
  echo "Installing latest release from npm ..."
  npm install webgme@latest
else
  # is it a valid webgme release version number
  release_count="$(npm view webgme versions | grep -c "'$1'")"
  if [ $release_count -gt 0 ]; then
    echo "Found webgme release in npm registry: $1"
    npm install webgme@$1
  else
    # trying to use it as a branch or tag or hash
    branch_or_tag="$1"

    commit_hash="$(git ls-remote git://github.com/webgme/webgme.git refs/heads/$branch_or_tag | cut -f 1)"
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

    npm install https://github.com/webgme/webgme/tarball/$commit_hash
  fi
fi

sudo start webgme

npm list webgme --long

logfile=`basename $0`.log
echo "$logfile"
npm list webgme --long true > $logfile
npm list webgme --parseable --long  >> $logfile

if [ -n "$branch_or_tag" ]; then
  echo "installed from github" >> $logfile
  echo "branch tag or hosh $branch_or_tag" >> $logfile
  echo "commit $commit_hash" >> $logfile
 
  echo "branch or tag or hash link https://github.com/webgme/webgme/tree/$branch_or_tag" >> $logfile
  echo "commit link https://github.com/webgme/webgme/tree/$commit_hash" >> $logfile
else
  echo "installed from npm registry" >> $logfile
fi

datetime="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "installed on $datetime" >> $logfile
