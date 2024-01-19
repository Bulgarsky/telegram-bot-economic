require("dotenv").config();
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const { JSDOM } = require('jsdom');

//use your telegram apikey (from @botfather) on .env or Here:
const bot = new Telegraf(process.env.BOT_API_KEY);

//new
const dataService = require('./src/services/data.service.js');
const Message = require('./src/services/Message.js');
const Helpers = require('./src/services/Helpers.js');
const HtmlParser = require('./src/services/html.parser.js');

//

bot.start((context) => {
    const userFirstName = context.update.message.from.first_name;
    context.reply(`Приветствую, ${userFirstName} для просмотра команд используйте:`);
    context.reply('/help');
});
bot.help( (context) =>{
    context.reply(
        "Основные команды: \n " +
        "/menu - основное меню \n " +
        "/cbrf - офф.данные от ЦБ РФ \n " +
        "\n" +
        "/help - помощь");
});

const firstMenu = Markup
    .keyboard([
        ['Курс валют от currencyLayer'],
        ['Данные от ЦБ РФ', 'BRENT'],
        ['proFinance.ru', '/help']
    ])
    .oneTime()
    .resize();

const cbrfMenu = Markup
    .keyboard([
        ['< Назад', 'Инфляция'],
        ['Курсы', 'Вся валюта'],
        ['Ставка/месяцы', 'Ставка/неделя'],
        ['RUONIA (short)', 'RUONIA (full)']
    ])
    .oneTime()
    .resize();
bot.command('menu', async (context) => {
    return await context.reply('/menu',
        firstMenu
    );
});
bot.command('cbrf', async (context) =>{
    return await context.reply('/cbrf',
        cbrfMenu
    );
})

bot.hears('Данные от ЦБ РФ', async(context) => {
    return await context.reply('/cbrf',
        cbrfMenu
    );
});

bot.hears('< Назад', async (context) => {
    await context.reply('/menu',
        firstMenu
    );
});

bot.hears('Курсы', async (context) => {
    //new
    let { Date, Currency } = await dataService.getFavoriteCurrency();
    let title = "ЦБ РФ. Краткий список валют (Дата: День +1)";
    let msg = Message.CurrencyRatesFromXML(Currency, Date, title);
    context.reply(msg);
});

bot.hears('Вся валюта', async(context) => {
    let { Date, Currency } = await dataService.getAllCurrency();
    let title = "ЦБ РФ. Полный список (День +1)";
    let msg = Message.CurrencyRatesFromXML(Currency, Date, title);
    context.reply(msg);
});

bot.hears('Ставка/неделя', async (context) => {
    let obj = await HtmlParser.CbrfRatePerWeek();
    let msg = Message.CbrfRatePerWeek(obj);
    context.reply(msg);
});


bot.hears('RUONIA (full)', async (context) => {
    let ruonia = await HtmlParser.Ruonia("full");
    let msg = Message.CbrfRuonia(ruonia);
    context.reply(msg);
});

bot.hears('RUONIA (short)', async (context) => {
    let ruonia = await HtmlParser.Ruonia("short");
    let msg = Message.CbrfRuonia(ruonia);
    context.reply(msg);
});











//Deprecated. READ ON apilayer.api.js
//NEED FIX AFTER feb-01
bot.hears('Курс валют от currencyLayer', async (context) => {
    context.reply("Deprecated");
});

//no implement yet
bot.hears('BRENT', (context) => {
    context.reply("Пых пых пых пух пых. Пук. Тыдыщ. ФФффффшшшшшшш...");
});

bot.hears('proFinance.ru', (context) => {
    context.reply("Пых пых пых пух пых. Пук. Тыдыщ. ФФффффшшшшшшш...");
    context.reply("https://www.profinance.ru/quotes/");
});

bot.launch()
    .then((result) => {
        console.log('Bot started');
    })
    .catch((error) => console.error("bot.launch() .catch ERROR: ", error));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
