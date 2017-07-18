# Build a docker image for this repository
# 1. make sure docker is installed
# 2. make sure you have a clean copy of this repository
# 3. go to the directory where this file exists (the root of your repo)
# 4. $ docker build -t webgme-org --build-arg webgme_repo=webgme@latest .
# 5. export image: $ docker save -o webgme-org.tar webgme-org

# After successful startup, you should be able to connect to your dockerized webgme on the 8888 port of the host.
#
# Useful commands
# checking the status of your docker containers:    docker ps -a
# restart your docker container:                    docker restart webgme-seaml
# stop your container:                              docker stop webgme-seaml
# removing your container:                          docker rm webgme-seaml
# removing your image:                              docker rmi webgme-seaml
# list available images:                            docker images
# exporting the image:                              docker save -o webgme-seaml.tar webgme-seaml
# import an image:                                  docker load -i webgme-seaml.tar


# https://github.com/nodejs/docker-node/blob/3b038b8a1ac8f65e3d368bedb9f979884342fdcb/6.9/Dockerfile
FROM node:boron
MAINTAINER Patrik Meijer <patrik.meijer@vanderbilt.edu>
ARG webgme_repo=webgme@latest

RUN apt-get update

# Install git
RUN apt-get install -y git

RUN mkdir /usr/app

WORKDIR /usr/app

# copy app source
ADD . /usr/app/

# Install node-modules
RUN npm install

# Install webgme
RUN npm install ${webgme_repo}

# Set environment variable in order to use ./config/config.docker.js
ENV NODE_ENV docker

EXPOSE 8888

CMD ["npm", "start"]