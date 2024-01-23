require("dotenv").config();
const { Telegraf, Markup } = require('telegraf');

//use your telegram apikey (from @botfather) on .env or Here:
const bot = new Telegraf(process.env.BOT_API_KEY);

//new
const dataService = require('./src/services/data.service.js');
const apiCL = require('./src/api/apilayer.api');
const Message = require('./src/services/Message.js');


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
        ['Ставка/месяцы', 'Ставка по дням'],
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

//+
bot.hears('Курсы', async (context) => {
    //new
    let { Date, Currency } = await dataService.getFavoriteCurrency();
    let title = "ЦБ РФ. Краткий список валют (Дата: День +1)";
    let msg = Message.CurrencyRatesFromXML(Currency, Date, title);
    context.reply(msg);
});

//+
bot.hears('Вся валюта', async(context) => {
    let { Date, Currency } = await dataService.getWholeCurrency();
    let title = "ЦБ РФ. Полный список (День +1)";
    let msg = Message.CurrencyRatesFromXML(Currency, Date, title);
    context.reply(msg);
});

//+
bot.hears('Ставка по дням', async (context) => {
    let obj = await dataService.getCbrfRateForWeekByDay();
    let msg = Message.CbrfRateForWeekByDay(obj);
    context.reply(msg);
});
//

//+
bot.hears('RUONIA (full)', async (context) => {
    let ruonia = await dataService.getRuoniaFull();
    let msg = Message.CbrfRuonia(ruonia);
    context.reply(msg);
});

//+
bot.hears('RUONIA (short)', async (context) => {
    let ruonia = await dataService.getRuoniaShort();
    let msg = Message.CbrfRuonia(ruonia);
    context.reply(msg);
});

//+
bot.hears('Ставка/месяцы', async (context) => {
    let monthRate = await dataService.getCbrfRateByMonth();
    let msg = Message.CbrfRateByMonth(monthRate);
    context.reply(msg);
});

//+
bot.hears('Инфляция', async (context) => {
    let inflation = await dataService.getCbrfInflationByMonth();
    let msg = Message.CbrfInflationByMonth(inflation);
    context.reply(msg);
});



//Deprecated. READ ON apilayer.api.js
//NEED FIX AFTER feb-01
bot.hears('Курс валют от currencyLayer', async (context) => {
    context.reply("Deprecated");
    let ApiResponse = await dataService.getCurrencyFromApi();
    let success = ApiResponse.success;
    switch (success){
        case false:
            let { error: { code, info } } = ApiResponse;
            let errorMsg = Message.CurrencyLayerApiError(code, info);
            context.reply(errorMsg);
            break;
        case true:
            // console.log("ApiResponse.success/true: ", ApiResponse.success);
            //ДОДЕЛАТЬ ПОСЛЕ 1го ФЕВРАЛЯ
            let { Date, Currency } = apiCL.DataRepack(ApiResponse);
            let title = "Курс валют от CurrencyLayer API";
            //let msg =
            context.reply("msg");
            break;
        default:
            console.log("default switch on Курс валют от currencyLayer");
            context.message("default switch on Курс валют от currencyLayer");
    }
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
