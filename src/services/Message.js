let service = {};

//сообщение: ключевая ставка/месяц
service.CbrfRateByMonth = (obj) => {
    let msg = "Ключевая ставка Банка России по месяцам\n " +
        "https://cbr.ru/hd_base/infl/ \n \n" +
        "Дата \n";
    for (let key in obj) {
        msg += `${obj[key].date}, \t \t \t ${obj[key].cbrfRate} %\n`;
    }
    return msg;
}
//сообщение: инфляция
service.CbrfInflationByMonth = (obj) => {
    let msg = "ЦБ РФ. Инфляция год-к-году по месяцам \n " +
        "https://cbr.ru/hd_base/infl/ \n \n" +
        "Дата \t \t \t Инф. % \t \t Таргет \n";
    for (let key in obj) {
        msg += `${obj[key].date}, \t \t \t ${obj[key].inflationRate} \t \t \t ${obj[key].inflationTarget}\n`;
    }
    return msg;
}

//сообщение: руониа
service.CbrfRuonia = (obj) => {
    let msg = "Ставка RUONIA \n " +
        "https://cbr.ru/hd_base/ruonia/ \n \n";
    for (let key in obj) {
        msg += `${obj[key].title}, \t \t \t ${obj[key].value2} \n`;
    }
    msg += "\n \n ";
    for (let key in obj) {
        msg += `${obj[key].title}, \t \t \t ${obj[key].value1} \n `;
    }
    return msg;
}

//сообщение: - ключевая ставка/неделя
service.CbrfRateForWeekByDay = (obj) => {
    let msg = "Ключевая ставка Банка России на неделю (по дням)\n " +
        "https://cbr.ru/hd_base/KeyRate/ \n \n" +
        "Дата \n";
    for (let key in obj) {
        msg += `${obj[key].date}, \t \t \t ${obj[key].rate} %\n`;
    }
    return msg;
}

//сообщение: курс валют (для cbrfDaily)
service.CurrencyRatesFromXML = (obj, date, title) => {
    let msg = title + " на " + date + ": \n \n";

    for (let key in obj) {
        msg += obj[key].Nominal + " " + obj[key].Name + " = " + obj[key].Value.toFixed(4);
        //check obj hasOwn Previous key
        if(obj[key].hasOwnProperty('Previous')){

            let diff = +(obj[key].Value - obj[key].Previous).toFixed(4);
            if(diff < 0){
                msg += ` ▼ ${diff}\n`;
            }else{
                msg += ` ▲ +${diff}\n`;
            }

        } else {
            msg += " \n";
        }

    }
    return msg;
}



module.exports = service;