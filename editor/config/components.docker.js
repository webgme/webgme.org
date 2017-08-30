/*jshint node:true*/
/**
 * @author kecso / https://github.com/kecso
 */


var components = require('./components.json');

components.FormulaEditor = {
    baseUrl: 'http://' + process.env['4MLMACHINE_PORT_8001_TCP_ADDR'] +
    ':' + process.env['4MLMACHINE_PORT_8001_TCP_PORT'] + '/4ml'
};

components.UIRecorderRouter = {
    mongo: {
        uri: 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':' + process.env.MONGO_PORT_27017_TCP_PORT + '/webgme-ui-recording-data',
        options: {}
    }
};

module.exports = components;
