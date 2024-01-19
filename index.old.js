require("dotenv").config();
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const { JSDOM } = require('jsdom');


//use your telegram apikey (from @botfather) on .env or Here:
const bot = new Telegraf(process.env.BOT_API_KEY);

//use YOUR CurrencyLayer.com APIKEY on .env or here:
const currencyLayer= process.env.CURRENCYLAYER_API;

const cbrfUrl = "https://www.cbr-xml-daily.ru/daily_json.js";

const cbrfRates = {};
const cbrfInflation = {};
const cbrfWeeklyRate ={};
const fullRuonia = {};
const shortRuonia = {};


//new
const dataService = require('./src/services/data.service.js');


//middleware
/*
bot.use(async (context, next) => {
    await axios.get(cbrfUrl)
        .then(response => response.data)
        .then((data) => {
            context.state.cbrfDate = data.Timestamp.toString().slice(0, 10);
            context.state.cbrfList = data;
        }).catch((error) => {
            console.log("axios.get ERROR: ", error);
        });
    await next();
});
*/

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


//triggers

bot.hears('test', async(context) => {
    console.log("-----------------")
    //new
    let obj = dataService.getCurrencyDailyDataShort();
    console.log("OBJECT: ", obj);
    console.log("-----------------")
    context.reply("test done");
});
/*
bot.hears('Курсы', async(context) => {

    let cbrfDate = context.state.cbrfDate;
    let list = context.state.cbrfList.Valute;

    let favCurrency = ["USD", "EUR", "GBP", "CNY", "KZT", "TRY"];
    let favlist = {};
    for (let key in list) {
        if (favCurrency.includes(key)){
            favlist[key] = list[key];
        }
    }

    let cbrfTitle = "ЦБ РФ. Краткий список (День +1)";
    let msg = getCurrencyRatesReply(favlist, cbrfDate, cbrfTitle);

    context.reply("msg");
});

bot.hears('Вся валюта', async(context) => {
    let cbrfDate = context.state.cbrfDate;
    let list = context.state.cbrfList.Valute;
    let cbrfTitle = "ЦБ РФ. Полный список (День +1)";
    let msg = getCurrencyRatesReply(list, cbrfDate, cbrfTitle);
    context.reply(msg);
});

bot.hears('Курс валют от currencyLayer', async (context) => {
    await axios.get(`http://apilayer.net/api/live?access_key=${currencyLayer}&currencies=USD,EUR,GBP,KZT,CNY&source=RUB&format=1`)
        .then(response => response.data)
        .then((data) => {

            let currencyDate = new Date(data.timestamp * 1000).toLocaleString();
            //object repacking
                const obj = {
                    USD: {
                        Nominal: 1,
                        NumCode: '840',
                        CharCode: "USD",
                        Name: "доллар США",
                        Value: +(1 / data.quotes.RUBUSD)
                    },
                    EUR: {
                        Nominal: 1,
                        NumCode: '978',
                        CharCode: 'EUR',
                        Name: "евро",
                        Value: +(1 / data.quotes.RUBEUR)
                    },
                    GBP: {
                        Nominal: 1,
                        NumCode: '826',
                        CharCode: 'GBP',
                        Name: "фунт стерлингов",
                        Value: +(1 / data.quotes.RUBGBP)
                    },
                    KZT: {
                        Nominal: 1,
                        NumCode: '398',
                        CharCode: 'KZT',
                        Name: "казахстанских тенге",
                        Value: +(1 / data.quotes.RUBKZT)
                    },
                    CNY: {
                        Nominal: 1,
                        NumCode: '156',
                        CharCode: 'CNY',
                        Name: "китайсский юань",
                        Value: +(1 / data.quotes.RUBCNY)
                    }
                };

            context.state.currencyDate = currencyDate;
            context.state.currency = obj;
            }
        ).catch((error) => {
            console.log("bot.hears(), axios.get ERROR: ", error);
        });

    let obj = context.state.currency;
    let date = context.state.currencyDate;
    let currencyTitle = "Курс валют от currencyLayer";

    let msg = getCurrencyRatesReply(obj, date, currencyTitle);

    context.reply(msg);
});


bot.hears('Ставка/месяцы', async (context) => {
    if (!Object.keys(cbrfRates).length) {
        await fetchCbrfBases();
    }
    let msg = getBaseRatesReply(cbrfRates);
    context.reply(msg);
});

bot.hears('Инфляция', async (context) => {
    if (!Object.keys(cbrfInflation).length) {
        await fetchCbrfBases();
    }
    let msg = getBaseInflationReply(cbrfInflation);
    context.reply(msg);
});


bot.hears('BRENT', (context) => {
    context.reply("Пых пых пых пух пых. Пук. Тыдыщ. ФФффффшшшшшшш...");
});

bot.hears('proFinance.ru', (context) => {
    context.reply("Пых пых пых пух пых. Пук. Тыдыщ. ФФффффшшшшшшш...");
    context.reply("https://www.profinance.ru/quotes/");
});


bot.hears('Ставка/неделя', async (context) => {
    if(!Object.keys(cbrfWeeklyRate).length) {
        await fetchCbrfWeeklyKeyRate();
    }
    let msg = getWeeklyRateReply(cbrfWeeklyRate);
    context.reply(msg);
});
bot.hears('RUONIA (short)', async (context) => {

    if(!Object.keys(shortRuonia).length) {
        await fetchRuonia();
    }
    let msg = getRuoniaReply(shortRuonia);
    context.reply(msg);
});

bot.hears('RUONIA (full)', async (context) => {

    if(!Object.keys(fullRuonia).length) {
        await fetchRuonia();
    }
    let msg = getRuoniaReply(fullRuonia);
    context.reply(msg);
});
*/

/*
function getWeeklyRateReply(obj){
    let msg = "Еженедельная ключевая ставка Банка России \n " +
        "https://cbr.ru/hd_base/KeyRate/ \n \n" +
        "Дата \n";
    for (let key in obj) {
        msg += `${obj[key].date}, \t \t \t ${obj[key].rate} %\n`;
    }
    return msg;
}

//HTML parse cbr.ru/hd_base/KeyRate/
async function fetchCbrfWeeklyKeyRate(){
    console.log("fetchCbrfBases()");
    await axios.get("https://cbr.ru/hd_base/KeyRate/")
        .then(response => response.data)
        .then(data => {
            const dom = new JSDOM(data);
            const table = dom.window.document.getElementsByTagName("table")[0];

            let rows = table.rows;

            for (let i = 1; i < rows.length; i++) {
                let row = rows[i];
                let date = row.cells[0].textContent;
                let rate = row.cells[1].textContent;
                let rowName = "row" + i;
                cbrfWeeklyRate[rowName] = {
                    date,
                    rate
                }
            }
            //console.log("cbrfWeeklyRate: \n", cbrfWeeklyRate);
        });
}


function getRuoniaReply(obj){
    let msg = "Ставка RUONIA \n " +
        "https://cbr.ru/hd_base/ruonia/ \n \n";
    for (let key in obj) {
        msg += `${obj[key].title}, \t \t \t ${obj[key].value2} \n`;
    }
    msg += "\n \n "
    for (let key in obj) {
        msg += `${obj[key].title}, \t \t \t ${obj[key].value1} \n `;
    }
    return msg;
}

async function fetchRuonia(){

    await axios.get("https://cbr.ru/hd_base/ruonia/")
        .then(response => response.data)
        .then(data => {
            const dom = new JSDOM(data);
            const table = dom.window.document.getElementsByTagName("table")[0];
            let rows = table.rows;

            for (let i = 0; i < 2; i++ ) {
                let row = rows[i];
                let title = row.cells[0].textContent.trim();
                let value1 = row.cells[1].textContent;
                let value2 = row.cells[2].textContent;
                let rowName = "row" + i;
                shortRuonia[rowName] = {
                    title,
                    value1,
                    value2
                }
            }

            for (let i = 0; i < (rows.length - 1); i++) {
                let row = rows[i];
                let title = row.cells[0].textContent.trim();
                let value1 = row.cells[1].textContent;
                let value2 = row.cells[2].textContent;
                let rowName = "row" + i;
                fullRuonia[rowName] = {
                    title,
                    value1,
                    value2
                }
            }
        });
}

//message for reply
function getCurrencyRatesReply(obj, date, title){
    let msg = title + " на " + date + ": \n \n";

    for (let key in obj) {
        msg += obj[key].Nominal + " " + obj[key].Name + " = " + obj[key].Value.toFixed(4);
        //check obj hasOwn Previous key
        if(obj[key].hasOwnProperty('Previous')){

            let diff = +(obj[key].Value - obj[key].Previous).toFixed(4);
            if(diff < 0){
                msg += ` ▼ ${diff}\n`;
            }else{
                msg += ` ▲ +${diff}\n`;
            }

        } else {
            msg += " \n";
        }

    }
    return msg;
}
//HTML parsing cbr.ru/hd_base/infl/
async function fetchCbrfBases(){
    console.log("fetchCbrfBases()");
    await axios.get("https://cbr.ru/hd_base/infl/")
        .then(response => response.data)
        .then(data => {
            const dom = new JSDOM(data);
            const table = dom.window.document.getElementsByTagName("table")[0];
            let rows = table.rows;

            for (let i = 1; i < rows.length; i++) {
                let row = rows[i]; // take current row
                let date = row.cells[0].textContent; // take value from cell 1
                let cbrfRate = row.cells[1].textContent; // take value from cell 2
                let inflationRate = row.cells[2].textContent // take value from cell 3
                let inflationTarget = row.cells[3].textContent // take value from cell 4
                let rowName = "row" + i;
                //
                cbrfRates[rowName] = {
                    date,
                    cbrfRate
                }
                //
                cbrfInflation[rowName] ={
                    date,
                    inflationRate,
                    inflationTarget
                }
            }

        });
}

function getBaseRatesReply(obj){
    let msg = "Ключевая ставка Банка России \n " +
        "https://cbr.ru/hd_base/infl/ \n \n" +
        "Дата \n";
    for (let key in obj) {
        msg += `${obj[key].date}, \t \t \t ${obj[key].cbrfRate} %\n`;
    }
    return msg;
}
function getBaseInflationReply(obj){
    let msg = "ЦБ РФ. Инфляция в % год-к-году \n " +
        "https://cbr.ru/hd_base/infl/ \n \n" +
        "Дата \t \t \t Инф. % \t \t Таргет \n";
    for (let key in obj) {
        msg += `${obj[key].date}, \t \t \t ${obj[key].inflationRate} \t \t \t ${obj[key].inflationTarget}\n`;
    }
    return msg;
}
*/

bot.launch()
    .then((result) => {
        console.log('Bot started');
    })
    .catch((error) => console.error("bot.launch() .catch ERROR: ", error));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

