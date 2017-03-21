const express = require('express');
const app = express(); 
require('dotenv').config();
const telebot = require('node-telegram-bot-api');
const botToken = process.env.BOT_TOKEN; 
const bot = new telebot(botToken, {polling: true});



bot.onText(/\/remindme (.+)/, (msg, match) => {
    const chatID = msg.chat.id; 
    const toRemind = match[1]; 

    bot.sendMessage(chatID, toRemind); 
});



app.listen(3000, function() {
    console.log("app listening on port 3000");
})