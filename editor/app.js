// jshint node: true
'use strict';

var gmeConfig = require('./config'),
    webgme = require('webgme'),
    myServer;

webgme.addToRequireJsPaths(gmeConfig);

myServer = new webgme.standaloneServer(gmeConfig);

if (process.ENV.GME_ADMIN) {
    var admin = process.ENV.GME_ADMIN.split(':');
    if (admin.length !== 2) {
        throw new Error('GME_ADMIN should be of the format; user:password');
    }

    webgme.getGmeAuth(gmeConfig)
        .then(function (gmeAuth) {
            return gmeAuth.addUser(admin[0], 'em@il', admin[1], true, {siteAdmin: true});
        })
        .finally(function (err) {
            if (err) {
                if (err.message.indexOf('user already exists') > -1) {
                    console.log('Provided admin user already existed');
                } else {
                    console.error('Failed to create admin', process.ENV.GME_ADMIN, err);
                    process.exit(1);
                }
            }

            myServer.start(function () {
                //console.log('server up');
            });
        });
} else {
    myServer.start(function () {
        //console.log('server up');
    });
}

