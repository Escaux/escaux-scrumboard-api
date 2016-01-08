var request = require('request'),
    soap    = require('soap');

function MantisConnect(url, username, password) {
    this.url = url;
    this.client = null;
    this.req = request.defaults({
        auth: {
            username: username,
            password: password
        }
    });
}

MantisConnect.prototype.initialize = function() {
    var self = this;

    return new Promise(function(resolve, reject) {
        soap.createClient(self.url, {
            request: self.req
        }, function(err, client) {
            if (err) {
                return reject('Failed to create client.');
            }

            self.client = client;

            return resolve();
        });
    });
};

MantisConnect.prototype.getProjectIdFromName = function(name) {
    // TODO test name parameter
    return this.query('mc_project_get_id_from_name', {
        project_name: name
    })
    .then(function(result) {
        return result.return['$value'];
    });
};

/**
 * @param {integer} limit - Default limit to 100
 */
MantisConnect.prototype.getProjectIssues = function(id, limit) {
    // TODO test id parameter

    if (typeof limit != 'number') {
        limit = 100;
    }

    return this.query('mc_project_get_issues', {
        project_id: id,
        page_number: 0,
        per_page: limit,
    })
    .then(function(result) {
        return result.return.item.map(function(issue) {
            return issue.id['$value'];
        });
    });
};

MantisConnect.prototype.getIssue = function(id) {
    // TODO test id parameter

    return this.query('mc_issue_get', {
        issue_id: id,
    })
    .then(function(result) {
        var issue = {
            id: result.return.id['$value'],
            view_state: result.return.view_state.name['$value'],
            last_updated: result.return.last_updated['$value'],
            project: result.return.project.id['$value'],
            category: result.return.category['$value'],
            priority: result.return.priority.name['$value'],
            severity: result.return.severity.name['$value'],
            status: result.return.status.name['$value'],
            reporter: result.return.reporter.name['$value'],
            summary: result.return.summary['$value'],
            reproducibility: result.return.reproducibility.name['$value'],
            date_submitted: result.return.date_submitted['$value'],
            // sponsorship_total: result.return.sponsorship_total['$value'],
            // projection: result.return.projection.name['$value'],
            // eta: result.return.eta.name['$value'],
            resolution: result.return.resolution['$value'],
            description: result.return.description['$value'],
            // steps_to_reproduce: result.return.steps_to_reproduce['$value'],
            // attachment: result.return.attachment['$value'],
            // relationships: result.return.relationships['$value'],
            // notes: result.return.notes['$value'],
            // monitors: result.return.monitors['$value'],
            // sticky: result.return.sticky['$value'],
            // tags: result.return.tags['$value'],
        };

        result.return.custom_fields.item.forEach(function(item) {
            switch (item.field.name['$value']) {
                case 'Sprint':
                    issue.sprint = item.value['$value'];
                    break;
                case 'Story points':
                    issue.story_points = item.value['$value'];
                    break;
                case 'Team':
                    issue.team = item.value['$value'];
                    break;
                case 'Test plan':
                    issue.test_plan = item.value['$value'];
                    break;
                case 'Initial story points':
                    issue.initial_story_points = item.value['$value'];
                    break;
                case 'OTRS Ticket':
                    issue.otrs_ticket = item.value['$value'];
                    break;
                case 'Printed':
                    issue.printed = item.value['$value'];
                    break;
                case 'Target date':
                    issue.target_date = item.value['$value'];
                    break;
            }
        });

        return issue;
    });
};

MantisConnect.prototype.query = function(func, args) {
    var self = this;

    // Set username and password
    args.username = this.username;
    args.password = this.password;

    return new Promise(function(resolve, reject) {
        self.client[func](args, function(err, result) {
            if (err) {
                return reject('Failed to execute query "' + func + '".');
            }

            return resolve(result);
        });
    });
};


module.exports = MantisConnect;
