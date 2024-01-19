
const cbrfRates = {};
const cbrfInflation = {};



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


