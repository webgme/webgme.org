'use strict';

var config = require('./config.default');

config.server.port = 8888;

config.authentication.enable = false;
config.server.behindSecureProxy = false;
config.client.errorReporting.enable = false;

module.exports = config;
