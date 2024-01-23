const APILayer = require('../api/apilayer.api.js');
const XmlDailyCurrency = require('../api/cbrfdaily.xml.js');
const HTMLParser = require('./html.parser.js');


let service = {};

const favoriteCurrency = ["USD", "EUR", "GBP", "CNY", "KZT", "TRY"];

//+
service.getWholeCurrency = async () => {
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
    return await APILayer.getData();
}

service.getCbrfRateByMonth = async  () => {
    return await HTMLParser.Bases("RateByMonth");
}

service.getCbrfInflationByMonth = async  () => {
    return await HTMLParser.Bases("inflation");
}

service.getRuoniaShort = async  () => {
    return await HTMLParser.Ruonia("short");
}
service.getRuoniaFull = async  () => {
    return await HTMLParser.Ruonia("full");
}

service.CbrfRateForWeekByDay = async () => {
    return await HTMLParser.CbrfRateForWeekByDay();
}

module.exports = service;