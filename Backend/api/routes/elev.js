const express = require('express');
const  router = express();
var mysql = require("mysql");

const StatusLogger= require('../components/Statuslogger');
var con = mysql.createConnection({
    host: "iot.abbindustrigymnasium.se",
    user: "klass",
    password: "klasser",
    database: "klassrum"
  });
con.connect(function(err) {
    if (err) throw err;

});


router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Orders fetched'
    })
});



router.patch('/logout/:ClassName&:name', (req, res, next) => {
    req.params.ClassName= req.params.ClassName.toLowerCase();
    var UpdateProduct = function(){
        return new Promise(function(resolve,reject){
            
            con.query("UPDATE "+req.params.ClassName+" SET `Status` = ? , `Meddelande` = ?, `inloggad` = 0 WHERE `Namn` =  ?",["", "" ,req.params.name], function (err, result, fields) {
      
              if(err){                
                  return reject(err);
              }else{              
                  return resolve(result);
              }
      
          }); // query
        }); // Promise
      } // getDepartments

      UpdateProduct().then( result => {
        if (result.affectedRows>=1) {
            res.status(200).json({message: 'Logout'});
        }
        else
        res.status(200).json({message: "Update imposible, object does not exist to begin with"}); 
       }).catch(err => {
      res.status(500).json({
          error: err
      });
  });
});

//Uppdatera eleven , ny status
router.patch('/:ClassName&:name', (req, res, next) => {
    req.params.ClassName= req.params.ClassName.toLowerCase();
    var Uppdates = [req.body.Status,req.body.Meddelande,req.params.name];
    var UpdateProduct = function(){
        return new Promise(function(resolve,reject){
            StatusLogger.CreateStatuslog(req.params.ClassName);
            StatusLogger.CreateStatusPost(req.params.ClassName,Uppdates[2],Uppdates[0],"none").then(response =>{

                con.query("UPDATE "+req.params.ClassName+" SET `Status` = ? , `Meddelande` = ?, `inloggad` = ? WHERE `Namn` =  ?",[Uppdates[0], Uppdates[1], "1" ,Uppdates[2]], function (err, result, fields) {
                    if(err){                
                      return reject(err);
                  }else{              
                      return resolve(result);
                  }
          
              }); // query
                
            })
             

        }); // Promise
      } // getDepartments

      UpdateProduct().then( result => {
        if (result.affectedRows>=1) {
            res.status(200).json(
            {message: 'Success',result:result});
        }
        else
        res.status(200).json({message: "Update imposible, object does not exist to begin with"}); 
       }).catch(err => {
      res.status(500).json({
          error: err
      });
  });
});

router.delete('/:ClassName&:name', (req, res, next) => {
    req.params.ClassName= req.params.ClassName.toLowerCase();

    var RemoveProduct = function(){
        return new Promise(function(resolve,reject){
            const Name = req.params.name;
                con.query("DELETE FROM "+req.params.ClassName+" WHERE `Namn` =  ?",Name, function (err, result, fields) {
          
              if(err){                
                  return reject(err);
              }else{              
                  return resolve(result);
              }
      
          }); // query
        }); // Promise
      } // getDepartments


      
      RemoveProduct().then( result => {
          if (result.affectedRows>=1) {
              res.status(200).json(result);
          }
          else
          res.status(200).json({message: "Remove imposible, object does not exist to begin with"}); 
         }).catch(err => {
        res.status(500).json({
            error: err
        });
    });

});

router.get('/:ClassName&:name', (req, res, next) => {
 
    //req.body.name Skillnad = body tar det från kroppen medans params tar det från sökfältet
const ClassName = req.params.ClassName;
const Name=  req.params.name;
var getProduct = function(){
return new Promise(function(resolve,reject){

con.query("SELECT * FROM "+ClassName+" WHERE `Namn` = ?", [Name], function (err, result, fields) {

if(err){                
  return reject(err);
}else{              
  return resolve(result);
}

}); // query
}); // Promise
} // getDepartments

getProduct().then( result => {
if(result.length!=0){
res.status(200).json(result);
}
else
res.status(404).json({message: 'No such value exist'});

}).catch(err => {
res.status(500).json({
error: err
});
});

});

module.exports= router;