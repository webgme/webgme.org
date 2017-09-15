/*jshint node:true*/
/**
 * @author kecso / https://github.com/kecso
 */


var components = require('./components.json');

components.FormulaEditor = {
    baseUrl: 'http://' + process.env['4MLMACHINE_PORT_8001_TCP_ADDR'] +
    ':' + process.env['4MLMACHINE_PORT_8001_TCP_PORT'] + '/4ml'
};

module.exports = components;
