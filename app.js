var restify = require('restify');
var builder = require('botbuilder');

var timer = require('./timerHelper');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

var timers = {};

//=========================================================
// Bot Middleware
//=========================================================

// Either start or restart the timer everytime the bot receives OR sends a message
bot.use({
    receive: function (event, next) {
        console.log(event)
        // Pass the address to the timer so that the bot can send proactive messages
        timer.start(event.address);
        next();
    },
    send: function (event,next) {
        console.log(event)
        timer.start(event.address);
        next();
    }
});

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    (session, args) => {
        builder.Prompts.text(session, "Hi there, what's your name?");
    }, (session, results) => {
        session.endDialog("Nice to meet you, " + results.response + "!");
    }
]);