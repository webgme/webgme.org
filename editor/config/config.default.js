'use strict';

var config = require('./config.webgme'),
    path = require('path'),
    os = require('os');

config.server.port = 8001;

config.authentication.enable = true;
config.authentication.allowGuests = true;
config.authentication.guestAccount = 'demo';
//config.authentication.logOutUrl = 'http://' + os.hostname(); // FIXME: use config.server.https.enable to decide on protocol
config.authentication.jwt.privateKey = path.join(__dirname, '..', '..', '..', 'token_keys', 'private_key');
config.authentication.jwt.publicKey = path.join(__dirname, '..', '..', '..', 'token_keys', 'public_key');

config.rest.secure = true;

config.plugin.allowServerExecution = false;
config.executor.enable = false;
config.addOn.enable = false;
config.storage.emitCommittedCoreObjects = true;
config.mongo.uri = 'mongodb://127.0.0.1:27017/webgme';

config.seedProjects.basePaths.push('./seeds');
config.seedProjects.defaultProject = 'Boilerplate';

config.server.behindSecureProxy = true;

config.client.errorReporting.enable = true;
config.client.errorReporting.DSN = 'https://3118066a25db430086ad064fb35af2e8@sentry.io/118310';

//TODO This should probably not be configured from here (for now it will do)
config.visualization.svgDirs.push('./node_modules/power/Icons');

module.exports = config;
