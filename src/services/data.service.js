const APILayer = require('../api/apilayer.api.js');
const XmlDailyCurrency = require('../api/cbrfdaily.xml.js');

let service = {};

const favoriteCurrency = ["USD", "EUR", "GBP", "CNY", "KZT", "TRY"];

//+
service.getAllCurrency = async () => {
    const data = await XmlDailyCurrency.fetchData();
    let Currency = data.Currency;
    let Date = data.Date;

    return {
        Date,
        Currency
    }
}

//+
service.getFavoriteCurrency = async () => {
    const data = await XmlDailyCurrency.fetchData();
    let list = data.Currency;
    let Date = data.Date;
    let Currency = {}

    for (let key in list) {
        if (favoriteCurrency.includes(key)){
            Currency[key] = list[key];
        }
    }

    return {
        Date,
        Currency
    };

}

//LIMIT 100
service.getCurrencyFromApi = async () => {
    const data = await APILayer.fetchData();
}

module.exports = service;