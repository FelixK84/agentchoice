var path = require('path');
var mysql = require('mysql');
var dbc = require(path.join(__dirname, '..', 'config', 'dbc'));

var Mysql_modul = {

    insert_factor: (factor, ratearray, callback) => {

        console.log(ratearray);

        /*  the datum var has the format dd.MM.yyyy when it comes.
            for the query i need either integer or the timestamp format!  */
        dbc.getconnection((err, con) => {
            con.connect();

            var queryString = "INSERT INTO choices SET ?";

            var values = {
                factor: factor,
                btceth: ratearray[0].btceth,
                ethzec: ratearray[1].ethzec,
                btczec: ratearray[2].btczec,
                status: 0
            };

            con.query(queryString, values, (err, results, fields) => {
                con.end();
                if (err) {
                    callback(err);
                } else {
                    callback(null, true)
                }
            });
        });
    },

    getrate: (pair) => {
        return new Promise((resolve, reject) => {
            dbc.getconnection((err, con) => {
                con.connect();

                var queryString = "SELECT rate FROM ? ORDER BY `id` DESC LIMIT 1";

                con.query(queryString, [pair, pair], (err, results, fields) => {
                    con.end();
                    if (err) {
                        console.error(err);
                        reject(Error(err.message));
                    } else {
                        resolve(results.rate);
                    }
                });
            });
        });
    },

    getrate_btceth: (callback) => {
        dbc.getconnection((err, con) => {
            con.connect();

            var queryString = "SELECT * FROM btc_eth where id = (select max(id) from btc_eth)";

            /*var values = {

            };*/

            con.query(queryString, /*values,*/ (err, results, fields) => {
                con.end();
                if (err) {
                    callback(err);
                } else {
                    callback(null, results)
                }
            });
        });
    },

    getrate_btczec: (callback) => {
        dbc.getconnection((err, con) => {
            con.connect();

            var queryString = "SELECT * FROM btc_zec where id = (select max(id) from btc_zec)";

            /*var values = {

            };*/

            con.query(queryString, /*values,*/ (err, results, fields) => {
                con.end();
                if (err) {
                    callback(err);
                } else {
                    callback(null, results)
                }
            });
        });
    },

    getrate_ethzec: (callback) => {
        dbc.getconnection((err, con) => {
            con.connect();

            var queryString = "SELECT * FROM eth_zec where id = (select max(id) from eth_zec)";

            /*var values = {

            };*/

            con.query(queryString, /*values,*/ (err, results, fields) => {
                con.end();
                if (err) {
                    callback(err);
                } else {
                    callback(null, results)
                }
            });
        });
    },

    update_time: (id, date, from, to, callback) => {

        dbc.getconnection((err, con) => {
            con.connect();

            var queryString = "UPDATE times SET arbeitsbeginn = ?, arbeitsende = ? WHERE id = ?";

            //console.log(Time_modul.makedateobj(date, from));

            var values = [
                Time_modul.makedateobj(date, from),
                Time_modul.makedateobj(date, to),
                id
            ];

            //console.log(values[0]);
            //console.log(values[1]);
            //console.log(values.id);
            //console.log(values.arbeitsbeginn);
            //console.log(values.arbeitsende);

            con.query(queryString, values, (err, results, fields) => {
                con.end();
                if (err) {
                    callback(err);
                } else {
                    callback(null, true)
                }
            });
        });
    }
}

module.exports = Mysql_modul;
