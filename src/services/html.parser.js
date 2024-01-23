const axios = require("axios");
const {JSDOM} = require("jsdom");
const Helpers = require('./Helpers.js');

let service = {};

//
const cbrfWeeklyRate = {};
const cbrfRateByMonth = {};
const cbrfInflation = {}
const fullRuonia= {};
const shortRuonia = {};


//PARSE: rate by week
service.CbrfRatePerWeek = async () => {
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

        });

    return cbrfWeeklyRate;
}

//Check ruonia +
service.Ruonia = async (type) => {
    switch(type){
        case "full":
            if (!Helpers.isEmptyObject(fullRuonia)){
                return fullRuonia;
            } else{
                await parseRuonia();
                return fullRuonia;
            }

        case "short":
            if (!Helpers.isEmptyObject(shortRuonia)){
                return shortRuonia;
            } else{
                await parseRuonia();
                return shortRuonia;
            }
    }

}

//RUONIA +
const parseRuonia = async () => {
    await axios.get("https://cbr.ru/hd_base/ruonia/")
        .then(response => response.data)
        .then(data => {
            const dom = new JSDOM(data);
            const table = dom.window.document.getElementsByTagName("table")[0];
            let rows = table.rows;

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

                if(i < 2){
                    shortRuonia[rowName] = {
                        title,
                        value1,
                        value2
                    }
                }

            }
        });
}


//Bases: Inflation and Month rates
service.Bases = async (type) => {

    switch(type){
        case "inflation":
            if (!Helpers.isEmptyObject(cbrfInflation)){
                return cbrfInflation;
            } else{
                await CbrfBases();
                return cbrfInflation;
            }

        case "monthRate":
            if (!Helpers.isEmptyObject(cbrfRateByMonth)){
                return cbrfRateByMonth;
            } else{
                await CbrfBases();
                return cbrfRateByMonth;
            }

    }

}

//PARSE: inflation and rate by month
const CbrfBases = async () => {

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
                cbrfRateByMonth[rowName] = {
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



module.exports = service;