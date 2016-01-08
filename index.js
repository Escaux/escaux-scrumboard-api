'use strict';

var Hapi = require('hapi'),
    Config = require('config');

var server = new Hapi.Server();
server.connection({
    routes: {
        cors: true
    },
    port: 3000
});

server.register({
    register: require('./v1/index.js'),
    options: Config,
}, (err) => {
    if (err) {
        console.error('Failed to load plugin:', err);
    }

    server.start(() => {
        console.log('Server running at:', server.info.uri);
    });

});
