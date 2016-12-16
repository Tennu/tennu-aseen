var moment = require('moment');
var format = require('util').format;

function aseen(knex) {
    return {
        knex: knex,
        find: find
    };
};

function find(targetNick, targetChannel) {
    return this.knex('message').where({
            FromNick: targetNick,
            Channel: targetChannel
        }).orderBy('Timestamp', 'desc').first()
        .then(function(row) {
            if (row) {
                var now = moment(new Date());
                var timeAgoMessage = moment(row.Timestamp).from(now);
                if (row.MessageType === 'privmsg') {
                    return format('Last activity in %s %s: "%s".', targetChannel, timeAgoMessage, row.Message);
                }
                if (!row.Message) {
                    return format('Last activity in %s was a %s %s.', targetChannel, row.MessageType, timeAgoMessage);
                }
                
                return format('Last activity in %s was a %s %s: "%s".', targetChannel, row.MessageType, timeAgoMessage, row.Message);
            }
            else {
                return ('I have never seen any client activity from ' + targetNick + ' in ' + targetChannel);
            }
        });
};

module.exports = aseen;