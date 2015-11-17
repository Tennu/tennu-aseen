var Promise = require('bluebird');

var TennuAdvancedSay = {
    requiresRoles: ['dbcore'],
    init: function(client, imports) {

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
        const dbASeenPromise = imports.dbcore.then(function(knex) {
            return require('./aseen')(knex);
        });

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
                return dbASeenPromise.then(function(aseen) {
                    return aseen.find(command.args[0], command.channel).then(function(result) {
                        return result;
                    });
                })
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