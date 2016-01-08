var Sprint = require('../lib/sprint.js'),
    MantisConnect = require('../lib/mantisconnect.js'),
    request = require('request'),
    soap = require('soap');

var project = 'UEP :: Template';

exports.register = function (server, options, next) {
    var mc = new MantisConnect(options.url, options.username, options.password);
    mc.initialize();

    server.route([{
        method: 'GET',
        path: '/sprints/current/stories',
        handler: function (request, reply) {
            reply(new Sprint(Sprint.getSprintIdFromDate(new Date()))
                .getProjectIssues(mc, project));
        }
    }]);

    next();
};

exports.register.attributes = {
    name: 'myPlugin',
    version: '1.0.0'
};
