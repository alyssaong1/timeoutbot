const builder = require('botbuilder');

//=============================
// Timer Setup 
//=============================

var timers = {};
// time to wait in miliseconds
var time = 5000;

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);

module.exports = {
    start: function (address) {
        if (!timers[address.conversation.id]) {
            // If new conversation
            timers[address.conversation.id] = setTimeout(function () {
                // Time's up!
                sendProactiveMessage(address);
            }, 5000, address);
        } else {
            clearTimeout(timers[address.conversation.id]);
            timers[address.conversation.id] = setTimeout(function () {
                // Time's up!
                sendProactiveMessage(address);
            },5000, address);
        }
    },
    stop: function (address) {
        console.log('timer stop')
        clearTimeout(timers[address.conversation.id]);
    },
    get: function (address) {
        return timers[address.conversation.id];
    }
};

function sendProactiveMessage(address) {
    console.log(address);
    var msg = new builder.Message().address(address);
    msg.text("You have been idle for 15 minutes.");
    bot.send(msg);
}