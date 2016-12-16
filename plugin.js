var path = require('path');

var TennuAdvancedSay = {
    requiresRoles: ['dblogger', 'dbcore'],
    init: function(client, imports) {

        const knex = imports.dbcore.knex;

        const helps = {
            "aseen": [
                "{{!}}aseen <nick>"
            ]
        };

        var errorResponse = {
            intent: 'notice',
            query: true
        };

        // dbcore is a promise. It is returned after migrations are complete.
        var aseen = require('./lib/aseen')(knex);

        var lastSeen = (function() {
            return function(command) {
                if (command.args.length !== 1) {
                    helps.aseen.push('Not enough arguments. Usage:');
                    errorResponse.message = helps.aseen;
                    return errorResponse;
                }
                if (command.isQuery) {
                    errorResponse.message = 'This command is not avalible as a PM.';
                    return errorResponse;
                }
                return aseen.find(command.args[0], command.channel).then(function(result) {
                    return result;
                });
            }
        })();

        return {

            handlers: {
                "!aseen": lastSeen
            },

            help: {
                "aseen": helps.aseen
            },

            commands: ["aseen"]
        }
    }
};

module.exports = TennuAdvancedSay;
