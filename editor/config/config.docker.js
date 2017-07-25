'use strict';
var path = require('path'),
    config = require('./config.default'),
    validateConfig = require('webgme/config/validator');

config.authentication.jwt.privateKey = '/dockershare/token_keys/private_key';
config.authentication.jwt.publicKey = '/dockershare/token_keys/public_key';

config.blob.fsDir = '/dockershare/blob-local-storage';

// This is the exposed port from the docker container.
config.server.port = 8001;

// Connect to the linked mongo container N.B. container must be named mongo
config.mongo.uri = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':' + process.env.MONGO_PORT_27017_TCP_PORT + '/webgme';

validateConfig(config);
module.exports = config;