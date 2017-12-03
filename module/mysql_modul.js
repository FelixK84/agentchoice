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
                btceth: ratearray[0],
                ethzec: ratearray[1],
                btczec: ratearray[2],
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

                con.query(queryString, [pair], (err, results, fields) => {
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
    }
};

module.exports = Mysql_modul;
