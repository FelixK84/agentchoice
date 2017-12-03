var timer = require('./module/timer'),
    mysql_modul = require('module/mysql_modul');

timer('*/4 * * * * *', () => {
    Promise.all([
            mysql_modul.getrate('btc_eth'),
            mysql_modul.getrate('eth_zec'),
            mysql_modul.getrate('btc_zec'),
        ])
        .then((rates) => {
            console.log('btceth: ' + rates[0]);
            console.log('ethzec: ' + rates[1]);
            console.log('btczec: ' + rates[2]);
            console.log(calcho(rates));
            var fac = calcho(rates) - (0.0025 * 3);
            console.log("Abzgl. der Transaktionskosten: " + fac);
            if (fac > 1.02) {
                mysql_modul.insert_factor(fac, rates, (err, suc) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("Eine Möglichkeit steht zur Verfügung");
                    }
                });
            }
        });
});

function calcho(da) {
    return ((da[0]) * (da[1]) * (1 / da[2]));
}
