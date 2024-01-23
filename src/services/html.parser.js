const axios = require("axios");
const {JSDOM} = require("jsdom");
const Helpers = require('./Helpers.js');

let service = {};

//const
const cbrfWeeklyRate = {};
const cbrfRateByMonth = {};
const cbrfInflation = {}
const fullRuonia= {};
const shortRuonia = {};

//urls
const BasesURL = "https://cbr.ru/hd_base/infl/"; //inflation, rates by month
const RuoniaURL = "https://cbr.ru/hd_base/ruonia/"; //Ruonia
const RatePerWeekURL = "https://cbr.ru/hd_base/KeyRate/"; // rate per week (daily)

//parse html and get table:HTMLTableElement
//table.rows: HRMLCollectionOf<HTMLTableRowElement>
const getTableFromHTML = async (url) => {
    return await axios.get(url)
        .then(response => response.data)
        .then(data => {
            const dom = new JSDOM(data);
            const table = dom.window.document.getElementsByTagName("table")[0];
            return table.rows;
        });
}

//Cbrf: rate for week by day
service.CbrfRateForWeekByDay = async () => {
    let rows = await getTableFromHTML(RatePerWeekURL);

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
    return cbrfWeeklyRate;
}


//Cbrf: RUONIA
service.Ruonia = async (type) => {
    switch(type){
        case "full":
            if (!Helpers.isEmptyObject(fullRuonia)){
                return fullRuonia;
            } else{
                await getRuonia();
                return fullRuonia;
            }

        case "short":
            if (!Helpers.isEmptyObject(shortRuonia)){
                return shortRuonia;
            } else{
                await getRuonia();
                return shortRuonia;
            }
    }

}

//getRuonia
const getRuonia = async () => {
    let rows = await getTableFromHTML(RuoniaURL);
    for (let i = 0; i < (rows.length - 1); i++) {
        let row = rows[i];
        let rowName = "row" + (i+1);

        let title = row.cells[0].textContent.trim();
        let value1 = row.cells[1].textContent;
        let value2 = row.cells[2].textContent;

        fullRuonia[rowName] = {
            title,
            value1,
            value2
        }

        if(i < 2){
            shortRuonia[rowName] = {
                title,
                value1,
                value2
            }
        }

    }

}


//Cbrf Bases (switch): Inflation and Rates (Month)
service.Bases = async (type) => {

    switch(type){
        case "inflation":
            if (!Helpers.isEmptyObject(cbrfInflation)){
                return cbrfInflation;
            } else{
                await getBases("inflation");
                return cbrfInflation;
            }

        case "RateByMonth":
            if (!Helpers.isEmptyObject(cbrfRateByMonth)){
                return cbrfRateByMonth;
            } else{
                await getBases("RateByMonth");
                return cbrfRateByMonth;
            }

    }

}

//getBases
const getBases = async (type) => {
    let rows = await getTableFromHTML(BasesURL);

    for (let i = 1; i < rows.length; i++) {
        let row = rows[i]; // take current row
        let rowName = "row" + i;
        let date = row.cells[0].textContent; // cell[0] = date

        switch(type){

            case "RateByMonth":
                let cbrfRate = row.cells[1].textContent; //cell[1] = bank rate

                cbrfRateByMonth[rowName] = {
                    date,
                    cbrfRate
                }
                break;

            case "inflation":
                let inflationRate = row.cells[2].textContent //cell[2] = inf rate
                let inflationTarget = row.cells[3].textContent //cell[3] = inf target

                cbrfInflation[rowName] = {
                    date,
                    inflationRate,
                    inflationTarget
                }
                break;
        }

    }

}

module.exports = service;