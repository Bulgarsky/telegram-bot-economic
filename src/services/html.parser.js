const axios = require("axios");
const {JSDOM} = require("jsdom");

const Helpers = require('./Helpers.js');
let service = {};

//
const cbrfWeeklyRate = {};
const fullRuonia= {};
const shortRuonia = {};


//HTML parse cbr.ru/hd_base/KeyRate/
service.CbrfRatePerWeek = async () => {
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

        });

    return cbrfWeeklyRate;
}

//Check ruonia
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

//RUONIA
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

/*
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

*/

module.exports = service;