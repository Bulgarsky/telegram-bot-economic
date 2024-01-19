//
//DEPRECATED. NOW ONLY 100/month
//
//need add key-toggle
//
//response from api after limit down
/*
 {
     success: false,
     error: {
         code: 104,
         info: 'Your monthly usage limit has been reached. Please upgrade your Subscription Plan.'
     }
 }

 */
const axios = require("axios");

let service = {};

//use YOUR CurrencyLayer.com APIKEY on .env or here:
const currencyLayer = process.env.CURRENCYLAYER_API;
const currencyLayer2 = process.env.CURRENCYLAYER_API;

let ApiData = {};

service.fetchData = async () => {
    await axios.get(`http://apilayer.net/api/live?access_key=${currencyLayer}&currencies=USD,EUR,GBP,KZT,CNY&source=RUB&format=1`)
        .then(response => response.data)
        .then((data) => {

            let Date = (data.timestamp * 1000).toLocaleString();
                //object repacking
            const Currency = {
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

                ApiData = {
                    Date,
                    Currency
                }

            }
        ).catch((error) => {
            console.log("apilayer.api.js / axios.get ERROR: ", error);
        });

    return ApiData;
}

//toggle
service.getData = () => {}

module.exports = service;