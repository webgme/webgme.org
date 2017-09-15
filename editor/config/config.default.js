'use strict';

var config = require('./config.webgme'),
    path = require('path'),
    os = require('os');

config.server.port = 8001;

config.authentication.enable = true;
config.authentication.allowGuests = true;
config.authentication.guestAccount = 'demo';
config.authentication.logOutUrl = '';
config.authentication.jwt.privateKey = path.join(__dirname, '..', '..', '..', 'token_keys', 'private_key');
config.authentication.jwt.publicKey = path.join(__dirname, '..', '..', '..', 'token_keys', 'public_key');
config.requirejsPaths['widgets/DiagramDesigner'] =
    './node_modules/webgme-bip-editors/src/visualizers/widgets/DiagramDesigner';

config.requirejsPaths['bipsrc'] = './node_modules/webgme-bip/src';

config.plugin.allowServerExecution = false;
config.executor.enable = false;
config.addOn.enable = false;

config.mongo.uri = 'mongodb://127.0.0.1:27017/webgme';

config.seedProjects.basePaths.push('./seeds');
config.seedProjects.defaultProject = 'Boilerplate';

config.visualization.svgDirs.push('./node_modules/power/Icons');
config.visualization.svgDirs.push('./node_modules/webgme-bip/src/svgs');

config.rest.components.UIRecorder = {
    src: __dirname + '/../node_modules/webgme-ui-replay/src/routers/UIRecorder/UIRecorder.js',
    mount: 'routers/UIRecorder',
    options: {
        mongo: {
            uri: 'mongodb://127.0.0.1:27017/webgme-ui-recording-data',
            options: {}
        }
    }
};

module.exports = config;
