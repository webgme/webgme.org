/*globals*/
/**
 * Move this to ~/dockershare/extraconfigs.js
 *
 * @author pmeijer / https://github.com/pmeijer
 */

function extraConfigs(config) {
    config.server.behindSecureProxy = true;

    config.client.errorReporting.enable = true;
    config.client.errorReporting.DSN = 'https://3118066a25db430086ad064fb35af2e8@sentry.io/118310';
}

module.exports = extraConfigs;