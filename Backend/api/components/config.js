var mysql = require("mysql");

// var con = mysql.createConnection({
//     host: "iot.abbindustrigymnasium.se",
//     user: "klass",
//     password: "klasser",
//     database: "klassrum"
//   });
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "klassrum"
  });
con.connect(function(err) {
    if (err) throw err;
console.log("hello");
});
module.exports = con;