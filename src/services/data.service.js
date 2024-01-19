const apiLayer = require('../api/apilayer.api.js');
const XmlDailyCurrency = require('../api/cbrfdaily.xml.js');

let service = {};

const favoriteCurrency = ["USD", "EUR", "GBP", "CNY", "KZT", "TRY"];

//
service.getCurrencyDailyData = () => {
    const { cbrfDate, cbrfList } = XmlDailyCurrency.fetchData();

}

//
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

module.exports = service;