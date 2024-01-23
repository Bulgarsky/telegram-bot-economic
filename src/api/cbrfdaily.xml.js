const axios = require("axios");

let service = {};

const cbrfUrl = "https://www.cbr-xml-daily.ru/daily_json.js";
let cbrfDailyData = {};

service.fetchData = async () => {
    await axios.get(cbrfUrl)
        .then(response => response.data)
        .then((data) => {

            let Date = data.Timestamp.toString().slice(0, 10);
            let Currency = data.Valute;

            cbrfDailyData = {
                Date,
                Currency
            }

        }).catch((error) => {
            console.log("XML / axios.get / catch ERROR: ", error);
        });

    return cbrfDailyData;
}

module.exports = service;