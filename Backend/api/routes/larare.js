    const express = require('express');
    const  router = express();
    var mysql = require("mysql");
    var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "klassrum"
    });
    con.connect(function(err) {
        if (err) throw err;
        else
        console.log("funkar");

    });

    router.get('/', (req, res, next) => {


        con.query("SELECT * FROM klasser", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.status(200).json({
            message: 'Getter',
            result: result});
        });

        
    });







    router.get('/:classname', (req, res, next) => {
    
        //req.body.name Skillnad = body tar det från kroppen medans params tar det från sökfältet
    const ClassName = req.params.classname.toLowerCase();

    var getProduct = function(){
    return new Promise(function(resolve,reject){
//Måste delas upp i två då denna kollar vad som är inloggat, ibland vill man se vad som finns.
    con.query("SELECT * FROM "+ClassName+ " WHERE `inloggad` = 1", function (err, result, fields) {
    
    if(err){                
    return reject(err);
    }else{              
    return resolve(result);
    }

    }); // query
    }); // Promise
    } // getDepartments

    getProduct().then( result => {
          res.status(200).json(result);

    }).catch(err => {
        
    res.status(500).json({
    error: err
    });
    });

    });

        router.post('/:ClassName', (req, res, next) => {
            req.params.ClassName= req.params.ClassName.toLowerCase();
            var Login = function(){
                return new Promise(function(resolve,reject){
                var query="";
                Password= req.body.Pass;
                var inputs=[req.params.ClassName,Password];
                    query= "SELECT * FROM klasser  WHERE `Name` = ? AND `Password` = ?" ;
                    console.log(Password);
                    con.query(query,inputs, function (err, result, fields) {
            
                    if(err){                
                        return reject(err);
                    }else{              
                        return resolve(result);
                    }
            
                }); // query
                }); // Promise
            } // getDepartments
        
            Login().then( result => {
            console.log(result.length);
            if (result.length==1) {
                res.status(200).json({message: "Success"}); 
            }
            else
            res.status(200).json({message: "Failure"}); 
            
            }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
        });

//Returnerar error måste fixas
        router.patch('/:ClassName', (req, res, next) => {
            console.log("success");
            req.params.ClassName= req.params.ClassName.toLowerCase();
            var UpdateProduct = function(){
                return new Promise(function(resolve,reject){
                    
                  var erro;var resultat;
                var query="";
                var querytoClass= "";
                var inputs=[req.body.Meddelande,req.params.ClassName];
                    if (req.body.To==null) {
                    query= "UPDATE "+req.params.ClassName+" SET `Meddelandefrom` = ?" ;
                    querytoClass= "UPDATE klasser SET `Meddelande` = ?  WHERE `Name` = ?";
                
                    con.query(querytoClass,inputs, function (err, result, fields) { //Fungerar inte!?
                        if(err){                
                            console.log(err);
                         }else{              
                       console.log(result);     //resultat=result;
                         }
                    });    
                }
                    else
                    {
                    query= "UPDATE "+req.params.ClassName+" SET `Meddelandefrom` = ?  Where `Namn` = ?" ;
                    inputs=[req.body.Meddelande,req.body.To];
                    }
                    con.query(query,inputs, function (err, result, fields) {
                       
                if(err){                
                    return reject(err);
                }else{              
                    return resolve(result);
                }
                   
            
                }); // query
    
                }); // Promise
            } // getDepartments
    
            UpdateProduct().then( result => {
                //if (result.affectedRows>=1) {
                    res.status(200).json(result);
               // } else
              //  res.status(200).json({message: "Update imposible, object does not exist to begin with"}); 
            }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
        });
    
/*

*/
    module.exports= router;


