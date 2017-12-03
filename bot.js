var path = require('path');
var CronJob = require('cron').CronJob;
var mysql_modul = require(path.join(__dirname, 'module', 'mysql_modul'));

var da = [];



var job = new CronJob('*/4 * * * * *', () => {
    Promise.all([
            mysql_modul.getrate('btc_eth'),
            mysql_modul.getrate('eth_zec'),
            mysql_modul.getrate('btc_zec'),
        ])
        .then((rates) => {
            da[0] = {
                'btceth': rates[0]
            };
            da[1] = {
                'ethzec': rates[1]
            };
            da[2] = {
                'btczec': rates[2]
            };
            if (da.length !== 0) {
                console.log('btceth: ' + da[0].btceth);
                console.log('ethzec: ' + da[1].ethzec);
                console.log('btczec: ' + da[2].btczec);
            }
            if (da.length !== 0) {
                console.log(calcho(da));
                console.log("Abzgl. der Transaktionskosten: " + (calcho(da) - (0.0025 * 3)));
                var fac = calcho(da) - (0.0025 * 3);
                if (fac > 1.02) {
                    mysql_modul.insert_factor(fac, da, (err, suc) => {
                        if (err) {
                            console.error(err);
                        } else {
                            console.log("Eine Möglichkeit steht zur Verfügung");
                        }
                    });
                }
            }
        });
}, null, true);

function calcho(da) {
    return ((da[0].btceth) * (da[1].ethzec) * (1 / da[2].btczec));
}
