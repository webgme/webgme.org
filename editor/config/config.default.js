'use strict';

var config = require('./config.webgme'),
    os = require('os');

config.server.port = 8001;

config.authentication.enable = true;
config.authentication.allowGuests = true;
config.authentication.guestAccount = 'demo';
config.authentication.logOutUrl = 'http://' + os.hostname(); // FIXME: use config.server.https.enable to decide on protocol

config.rest.secure = true;

config.client.defaultContext.project = 'demo+SignalFlowSystem';
config.client.defaultContext.branch = 'master';
config.client.defaultContext.node = '/682825457'; //opens the FM Receiver

config.plugin.allowServerExecution = false;
config.executor.enable = false;
config.addOn.enable = false;
config.storage.emitCommittedCoreObjects = true;
config.mongo.uri = 'mongodb://127.0.0.1:27017/webgme';

module.exports = config;