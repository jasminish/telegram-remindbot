require('dotenv').config();
var token = process.env.TOKEN;
require('timers');
const Sugar = require('sugar-date');

var telebot = require('node-telegram-bot-api');
var bot;

if (process.env.NODE_ENV === 'production') {
    bot = new telebot(token);   
    bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
    bot = new telebot(token, {polling: true});
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

// parse time into ms 
function getTime(time) {
    console.log("getting time");
    function parseTime(regexp) {
        var t = time.match(regexp);
        return t ? parseInt((t[0].match(/\d+/))[0]) : 0; 
    }

    const h = parseTime(/\d+h/);
    const m = parseTime(/\d+m/);
    const s = parseTime(/\d+s/);

    return ((((h*60) + m)*60) + s) * 1000; 
}

// parse date into ms duration 
function getDate(reminder, delimiter) {
    const date = reminder.substr(0, reminder.indexOf(delimiter));
    const now = Date.parse(new Date()); 
    
    const later = Date.parse(Sugar.Date(date).raw); 
    return (later - now > 0) ? later-now : 0; 
}

function getMsg(reminder, delimiter) {
    return reminder.substr(reminder.indexOf(delimiter) + delimiter.length);
}

function remind(chatID, message) {
    bot.sendMessage(chatID, "Reminder: " + message);
}

// remind by date / time 
// date can be natural language (eg tomorrow 4pm) as defined by sugar-date
// requires ' / ' between date and language if date has whitespace
bot.onText(/\/remindme (.+)/, (msg, match) => {
    const chatID = msg.chat.id; 
    const reminder = match[1]; 
    const delimiter = reminder.search(/\s\/\s/) > 0 ? ' / ' : ' '; 

    const time = getDate(reminder, delimiter); 
    const message = getMsg(reminder, delimiter); 

    setTimeout(remind, time, chatID, message);
});

// remind by timer
// where timer = <hours>h<minutes>m<secs>s eg 5h2m10s
bot.onText(/\/timer (.+)/, (msg, match) => {
    const chatID = msg.chat.id; 
    const reminder = match[1]; 

    const time = getTime(reminder);
    const message = getMsg(reminder, ' '); 

    setTimeout(remind, time, chatID, message);
});

module.exports = bot;