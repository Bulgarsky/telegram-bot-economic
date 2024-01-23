//DEPRECATED. NOW ONLY 100/month
//need implement apikey-toggle function
//

const axios = require("axios");
const Helpers = require("../services/Helpers.js");

let service = {};

//use YOUR CurrencyLayer.com APIKEY on .env or here:
const currencyLayer = process.env.CURRENCYLAYER_API;
const currencyLayer2 = process.env.CURRENCYLAYER_API2;

let ApiData = {};
let ApiDataError = {};
let ApiResponse = {};

const fetchData =  async () => {
    await axios.get(`http://apilayer.net/api/live?access_key=${currencyLayer}&currencies=USD,EUR,GBP,KZT,CNY&source=RUB&format=1`)
        .then(response => response.data)
        .then((data) => {
            ApiResponse = data;
            }
        ).catch((error) => {
            console.log("apilayer.api.js / axios.get ERROR: ", error);
        });

    return ApiData;
}

// доделать после 1го февраля , обработать ответ от апи, переупаковать,
service.DataRepack = (obj) => {

    let Date = (obj.timestamp * 1000).toLocaleString();

    //object repacking
    const Currency = {
        USD: {
            Nominal: 1,
            NumCode: '840',
            CharCode: "USD",
            Name: "доллар США",
            Value: +(1 / obj.quotes.RUBUSD)
        },
        EUR: {
            Nominal: 1,
            NumCode: '978',
            CharCode: 'EUR',
            Name: "евро",
            Value: +(1 / obj.quotes.RUBEUR)
        },
        GBP: {
            Nominal: 1,
            NumCode: '826',
            CharCode: 'GBP',
            Name: "фунт стерлингов",
            Value: +(1 / obj.quotes.RUBGBP)
        },
        KZT: {
            Nominal: 1,
            NumCode: '398',
            CharCode: 'KZT',
            Name: "казахстанских тенге",
            Value: +(1 / obj.quotes.RUBKZT)
        },
        CNY: {
            Nominal: 1,
            NumCode: '156',
            CharCode: 'CNY',
            Name: "китайсский юань",
            Value: +(1 / obj.quotes.RUBCNY)
        }
    };

    ApiData = {
        Date,
        Currency
    }
    return ApiData;
}

service.getData = async () => {
    if (!Helpers.isEmptyObject(ApiResponse)) {
        return ApiResponse;
    } else {
        await fetchData();
        return ApiResponse;
    }

    /*
    //response with error (code 104)
    //response from api after limit down
         {
             success: false,
             error: {
             code: 104,
             info: 'Your monthly usage limit has been reached. Please upgrade your Subscription Plan.'
         }
     */
}

//toggle
//Can't implement cause api account must have a payment card (card of NON-Russian Banks)
service.ApiKeyToggle = () => {}

module.exports = service;