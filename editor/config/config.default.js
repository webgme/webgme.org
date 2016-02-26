'use strict';

var config = require('./config.webgme'),
    os = require('os'),
    redisPort = process.env.REDIS_PORT || '6379';

config.server.port = process.env.PORT ? parseInt(process.env.PORT) : 8001;

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

config.seedProjects.basePaths.push('./seeds');
config.seedProjects.defaultProject = 'Boilerplate';

config.server.sessionStore.type = 'redis';
config.server.sessionStore.options.url = 'redis:127.0.0.1:' + redisPort;

config.socketIO.adapter.type = 'redis';
config.socketIO.adapter.options.uri = '127.0.0.1:' + redisPort;

//TODO This should probably not be configured from here (for now it will do)
config.visualization.svgDirs.push('./node_modules/premonition/icons/png');

module.exports = config;
