/*globals process*/
'use strict';

var gmeConfig = require('./config'),
    webgme = require('webgme'),
    myServer;

webgme.addToRequireJsPaths(gmeConfig);

myServer = new webgme.standaloneServer(gmeConfig);

if (process.env.GME_ADMIN) {
    var admin = process.env.GME_ADMIN.split(':'),
        gmeAuth;

    if (admin.length !== 2) {
        throw new Error('GME_ADMIN should be of the format; user:password');
    }

    webgme.getGmeAuth(gmeConfig)
        .then(function (gmeAuth_) {
            gmeAuth = gmeAuth_;
            return gmeAuth.addUser(admin[0], 'em@il', admin[1], true, {siteAdmin: true});
        })
        .then(function () {
            console.log('Added new siteAdmin user:', admin[0]);
        })
        .catch(function (err) {
            if (err.message.indexOf('user already exists') > -1) {
                console.log('Admin user already existed: ', admin[0]);
            } else {
                console.error('Failed to create admin', process.env.GME_ADMIN, err);
                process.exit(1);
            }
        })
        .finally(function () {
            gmeAuth.unload()
                .then(function () {
                    myServer.start();
                })
                .catch(function (err) {
                    console.err(err);
                    process.exit(1);
                });
        })
        .done();

} else {
    myServer.start(function () {
        //console.log('server up');
    });
}

