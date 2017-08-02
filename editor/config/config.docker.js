'use strict';
var path = require('path'),
    fs = require('fs'),
    config = require('./config.default'),
    validateConfig = require('webgme/config/validator');

// lstatSync will throw is dockershare does not exist
if (fs.lstatSync('/dockershare').isDirectory() === false) {
    throw new Error('/dockershare has not been mapped make sure to pass "-v <directory>:/dockershare"');
}

config.authentication.jwt.privateKey = '/dockershare/token_keys/private_key';
config.authentication.jwt.publicKey = '/dockershare/token_keys/public_key';

// Make sure there are some keys for token generation
if (fs.lstatSync('/dockershare/token_keys').isDirectory() === false) {
    fs.mkdirSync('/dockershare/token_keys');
}

if ((fs.lstatSync('/dockershare/token_keys/private_key').isFile() &&
    fs.lstatSync('/dockershare/token_keys/public_key').isFile()) === false) {

    console.error('Token keys did not exist - will generate them (key size 1024)');
    var NodeRSA = require('node-rsa'),
        key = new NodeRSA({b: 1024});

    fs.writeFileSync('/dockershare/token_keys/private_key', key.exportKey('pkcs1-private'));
    fs.writeFileSync('/dockershare/token_keys/public_key', key.exportKey('pkcs8-public'));
}

config.blob.fsDir = '/dockershare/blob-local-storage';

// This is the exposed port from the docker container.
config.server.port = 8001;

// Connect to the linked mongo container N.B. container must be named mongo
config.mongo.uri = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':' + process.env.MONGO_PORT_27017_TCP_PORT + '/webgme';

// Finally load any extra configuration parameters from dockershare
try {
    require('/dockershare/extraconfigs.js')(config);
} catch (e) {
    logger.error(e);

}

validateConfig(config);
module.exports = config;