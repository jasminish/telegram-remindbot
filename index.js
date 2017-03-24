const express = require('express');
const app = express(); 

require('dotenv').config();
const botToken = process.env.BOT_TOKEN; 
const telebot = require('node-telegram-bot-api');
const bot = new telebot(botToken, {polling: true});

require('timers');
const Sugar = require('sugar-date');

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

function getDate(reminder) {
    const date = reminder.substr(0, reminder.indexOf(' '));
    const now = Date.parse(new Date()); 
    
    const later = Date.parse(Sugar.Date(date).raw); 
    return (later - now > 0) ? later-now : 0; 
}

function getMsg(reminder) {
    return reminder.substr(reminder.indexOf(' ')+1);
}

function remind(chatID, message) {
    bot.sendMessage(chatID, "Reminder: " + message);
}

// remind by date / time 
bot.onText(/\/remindme (.+)/, (msg, match) => {
    const chatID = msg.chat.id; 
    const reminder = match[1]; 

    const time = getDate(reminder); 
    const message = getMsg(reminder); 

    setTimeout(remind, time, chatID, message);
});

// remind by timer
// where timer = <hours>h<minutes>m<secs>s eg 5h2m10s
bot.onText(/\/timer (.+)/, (msg, match) => {
    const chatID = msg.chat.id; 
    const reminder = match[1]; 

    const time = getTime(reminder);
    const message = getMsg(reminder); 

    setTimeout(remind, time, chatID, message);
});

app.listen(3000, function() {
    console.log("app listening on port 3000");
})