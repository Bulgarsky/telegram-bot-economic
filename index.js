require("dotenv").config();
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const { JSDOM } = require('jsdom');

//use your telegram apikey (from @botfather) on .env or Here:
const bot = new Telegraf(process.env.BOT_API_KEY);

//new
const dataService = require('./src/services/data.service.js');

bot.start((context) => {
    const userFirstName = context.update.message.from.first_name;
    context.reply(`Приветствую, ${userFirstName} для просмотра команд используйте:`);
    context.reply('/help');
});

bot.hears('test', async (context) => {
    //new
    let { Date, Currency } = await dataService.getFavoriteCurrency();
    console.log('Date', Date);
    console.log('Currency', Currency);
    context.reply("test done");
});

bot.launch()
    .then((result) => {
        console.log('Bot started');
    })
    .catch((error) => console.error("bot.launch() .catch ERROR: ", error));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
