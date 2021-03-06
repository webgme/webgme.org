/*globals process, console, require*/
'use strict';

var fs = require('fs'),
    config = require('./config.default'),
    validateConfig = require('webgme/config/validator');

// lstatSync will throw is dockershare does not exist
if (fs.lstatSync('/dockershare').isDirectory() === false) {
    throw new Error('/dockershare has not been mapped make sure to pass "-v <directory>:/dockershare"');
}

config.authentication.jwt.privateKey = '/dockershare/token_keys/private_key';
config.authentication.jwt.publicKey = '/dockershare/token_keys/public_key';

// Make sure there are some keys for token generation
try {
    if (fs.lstatSync('/dockershare/token_keys').isDirectory() === false) {
        console.error('/dockershare/token_keys exists but is not a directory');
        process.exit(1);
    }
} catch (e) {
    if (e.code = 'ENOENT') {
        fs.mkdirSync('/dockershare/token_keys');
    }
}

try {
    if ((fs.lstatSync(config.authentication.jwt.privateKey).isFile() &&
        fs.lstatSync(config.authentication.jwt.publicKey).isFile()) === false) {
        console.error('token keys exists but both are not files (?)');
        process.exit(1);
    }
} catch (e) {
    if (e.code = 'ENOENT') {
        console.error('Token keys did not exist - will generate them (key size 1024)');
        var NodeRSA = require('node-rsa'),
            key = new NodeRSA({b: 1024});
        fs.writeFileSync(config.authentication.jwt.privateKey, key.exportKey('pkcs1-private'));
        fs.writeFileSync(config.authentication.jwt.publicKey, key.exportKey('pkcs8-public'));
    }
}

config.blob.fsDir = '/dockershare/blob-local-storage';

// This is the exposed port from the docker container.
config.server.port = 8001;

config.mongo.uri = 'mongodb://mongo:27017/webgme';

// Finally load any extra configuration parameters from dockershare
try {
    require('/dockershare/extraconfigs.js')(config);
} catch (e) {
    if (e.message.indexOf('Cannot find module') > -1) {
        console.log('/dockershare/extraconfigs.js not provided - will go on with defaults');
    } else {
        console.error('Problems with /dockershare/extraconfigs.js', e);
    }
}

validateConfig(config);
module.exports = config;
