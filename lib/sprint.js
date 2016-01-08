var moment = require('moment');

var SPRINT_DAYS = 14,
    START_DATE = new Date('2009-04-20');

function Sprint(id) {
    this.id = id;
}

Sprint.prototype.getStartDate = function() {
    var date = new Date(START_DATE);
    date.setDate(START_DATE.getDate() + ((this.id - 1) * SPRINT_DAYS));
    return date;
};

Sprint.prototype.getEndDate = function() {
    var date = new Date(START_DATE);
    date.setDate(START_DATE.getDate() + (this.id * SPRINT_DAYS));
    return date;
};

Sprint.prototype.getProjectIssues = function(mc, project) {
    var self = this;

    return mc.getProjectIdFromName(project)
    .then(function(id) {
        return mc.getProjectIssues(id, 1000);
    })
    .then(function(issues) {
        return Promise.all(issues.map(function(issue) {
            return mc.getIssue(issue);
        }));
    })
    .then(function(issues) {
        return issues.filter(function(issue) {
            return issue.sprint == self.id;
        });
    });
};

Sprint.getSprintIdFromDate = function(date) {
    if (! (date instanceof Date)) {
        throw Error('IllegalArgumentException date');
    }

    return Math.floor((moment(date).diff(START_DATE, 'days') / SPRINT_DAYS) + 1);
};

module.exports = Sprint;
