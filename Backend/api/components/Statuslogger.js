var mysql = require("mysql");

var con = mysql.createConnection({
    host: "iot.abbindustrigymnasium.se",
    user: "klass",
    password: "klasser",
    database: "klassrum"
  });
var moment = require('moment');

//Fungerar inte
CheckTable = function (ClassName) {
    con.query("select 1 from ? ", [ClassName], function (err, result, fields) {
        console.log(result);
        console.log("ger" + err);
        if (err) {
            return err;
        } else {

            return result;
        }

    }); // query

}

//Hämtar värden.
GetValues = function (ClassName, Name, Want) {
    return new Promise(function (resolve, reject) {

        con.query("SELECT " + Want + " FROM " + ClassName + " WHERE `Namn` = ?", [Name], function (err, result, fields) {

            if (err) {
                return reject(err);
            } else {
                return resolve(result);
            }

        }); // query
    }); // Promise
} // getDepartments


module.exports = {
    //Uppdatera tid mellan status och även steg.
    CreateStatusPost: function (Classname, Name, Status,Step) {
        return new Promise(function (resolve, reject) { //Skapar löftet
       
            if (Status != "")
                GetValues(Classname, Name, "Time, Status, steg").then(result => {
                
                    if ( result[0].Status=='') {
                        return resolve("dont");  
                    }
                    else
                    {
                    var starttime = result[0].Time;
                    var now = moment();
                    var dif = now.diff(starttime, 's');
                    var date = new Date(null);
                    date.setSeconds(dif);
                    var Timediff = date.toISOString().substr(11, 8);
                    let query = 'INSERT INTO ' + Classname + 'statuslog (Name, Status, Time, Step) VALUES (?)';
                   if (Status=="none") {
                    Status =result[0].Status;
                   }
                   else if (Step =="none") {
                    Step=result[0].steg;
                   }
                    let inputs = [Name, Status, Timediff,Step];

                    con.query(query, [inputs], function (err, result) {

                        if (err) {
                            return reject(err);
                        } else {
                            return resolve(result);
                        }

                    }); // query
                }
                })

        }); // Promise
    },
    GetStatuslogs: function (name,values) {

        return new Promise(function (resolve, reject) { //Skapar löftet
            con.query('SELECT '+values+' FROM ' + name + 'statuslog' , function (err, result) {
                    if (err) {
                        //console.log(err);             
                         return reject(err);
                    } else {
                        return resolve(result);
                    }

                });
        });
    }
    ,
    CreateStatuslog: function (name) {

        return new Promise(function (resolve, reject) { //Skapar löftet

            con.query('CREATE TABLE ' + name + 'statuslog  ( Id int UNSIGNED AUTO_INCREMENT PRIMARY KEY, Name varchar(255),  Status varchar(255), Time time, Step int );'
                , function (err, result) {
                    if (err) {
                        //console.log(err);             
                        // return reject(err);
                    } else {
                        console.log(result);
                        return resolve(result);
                    }

                });
        });
    }

};
