const express = require('express');
const  router = express();
var mysql = require("mysql");

const con= require('../components/config');



//GETREDStudents
router.get('/:ClassName', (req, res, next) => {
    GetRedStudents(req.params.ClassName, "PersonID ,Namn , Time, steg", "red").then(result => {
       //Sorterar efter Datum det blev rött.
        result.sort(function(a,b) {
    return a.Time - b.Time;
});
        res.status(200).json({
        message: 'Helplist fetched',
        parts: result
    })

    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
//Tömmer statusloggen.
router.delete('/:ClassName&:Name', (req, res, next) => {
    
    RemoveStatus(req.params.ClassName,req.params.Name).then(result => {
     
        res.status(200).json({
        message: result
    });

    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

RemoveStatus  = function(name,yourname){
    return new Promise(function(resolve,reject){ //Skapar löftet
        con.query("UPDATE "+name+"  SET `Status`= '' WHERE `Namn`=? ", [yourname], function(err,result) {
            if(err){          
                return reject(err);    }
                else
  return resolve(yourname+" in "+name+"'s classroom has been helped.");
      });
   
         
     
    });
    
};
//Tar bort alla studenter
RemoveStudent = function(name){
    return new Promise(function(resolve,reject){
      con.query("DELETE FROM "+name+"Statuslog", function (err, result, fields) {
        if(err){          
            return reject(err);    }
            else
return resolve("Removed from list");
      }); // query
 
    }); // Promise
  }; // getDepartments


//Gör helplist.




 GetRedStudents = function(name,values,Statement){
    return new Promise(function(resolve,reject){
    con.query("SELECT "+values+" FROM "+name+ " WHERE `Status` = ?",[Statement], function (err, result, fields) {
    
    if(err){                
      return reject(err);
    }else{              
      return resolve(result);
    }
    
    }); // query
    }); // Promise
    } // getDepartments
    




module.exports= router;
