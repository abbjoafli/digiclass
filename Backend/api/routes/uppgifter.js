const express = require('express');
const  router = express();
var mysql = require("mysql");
const StatusLogger= require('../components/Statuslogger');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
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

router.get('/:ClassName', (req, res, next) => {
    GetOldValues(req.params.ClassName+"uppgift", "*").then(result => {
res.status(200).json({
        message: 'Assignment fetched',
        parts: result
    })

    });
    
});



CreateAssignment = function(name){ //Skapar funktionen
    return new Promise(function(resolve,reject){ //Skapar löftet
        //[[ value]] , [[ [product.name,product.price]]] 
        con.query('CREATE TABLE '+name+'uppgift  ( Id int UNSIGNED AUTO_INCREMENT PRIMARY KEY, Headline varchar(255),  Text varchar(255), Student_on_this_stage int(11) NOT NULL DEFAULT "0" );'
     , function(err,result) {
          if(err){                
              return reject(err);
          }else{              
              return resolve(result);
          }
  
      });
    });
  };

  RemoveAssignment = function(name, texts){
    return new Promise(function(resolve,reject){
        for (let index = 0; index < texts.length; index++) {
          
            con.query("DELETE FROM "+name+" WHERE  ?",[texts[index]], function (err, result, fields) {
          if(err){                
             console.log(err);
          }
  
      }); // query
    }
    return resolve("Lysande");
    }); // Promise
  }; // getDepartments

 PopulateAssignment  = function(name,headlines, texts){

    return new Promise(function(resolve,reject){ //Skapar löftet
for (let index = 0; index < headlines.length; index++) {
        con.query("INSERT INTO "+name+"uppgift (Headline,Text) VALUES (?,?) ", [headlines[index],texts[index],name], function(err,result) {
            if(err){          
                console.log(err);    }
  
      });
    }           
         return resolve("lysande");
     
    });
    
};


UpdateStudentOnAssignment  = function(name,steg,formersteg,yourname){
  
    return new Promise(function(resolve,reject){ //Skapar löftet

        con.query("UPDATE "+name+"uppgift  SET `Student_on_this_stage`= `Student_on_this_stage`+1 WHERE `Id`=? ", [steg], function(err,result) {
            if(err){          
                console.log(err);    }
  
      });
      con.query("UPDATE "+name+"uppgift  SET `Student_on_this_stage`= `Student_on_this_stage`-1 WHERE `Id`=? ", [formersteg], function(err,result) {
        if(err){          
            console.log(err);    }

  });   
  con.query("UPDATE "+name+"  SET `steg`=? WHERE `Namn`=? ", [steg,yourname], function(err,result) {
    if(err){          
        console.log(err);    }

});  
         return resolve("steg uppdaterade,"+formersteg+"-1   "+steg+"+1");
     
    });
    
};


 GetOldValues = function(name,values){
    return new Promise(function(resolve,reject){
    
    con.query("SELECT "+values+" FROM "+name, function (err, result, fields) {
    
    if(err){                
      return reject(err);
    }else{              
      return resolve(result);
    }
    
    }); // query
    }); // Promise
    } // getDepartments
    

UpdateUppgiftcount = function(steg,name){ //Skapar funktionen
    return new Promise(function(resolve,reject){ //Skapar löftet

        con.query("UPDATE `klasser` SET  `Uppgiftsteg` = ?  WHERE `Name`= ? ", [steg, name], function(err,result) {
         if(err){          
             console.log(err);      
              return reject(err);
          }else{              
              return resolve(result);
          }
  
      });
    });
  };

  UpdateAssignment = function(name,headlines, texts, ids){ //Skapar funktionen
    return new Promise(function(resolve,reject){ //Skapar löftet
        //[[ value]] , [[ [product.name,product.price]]]  
        for (let index = 0; index < headlines.length; index++) {
           con.query('UPDATE '+name+'uppgift  SET  `Headline` = ?, `Text` = ?   WHERE  ? ', [headlines[index],texts[index],ids[index]],  function(err,result) {
            if(err){          
                console.log(err);   
              }                  
          });
    }
    return resolve("lysande");
    });
  };


//Skapar ny klass och lägger in i lärarklass
router.post('/', (req, res, next) => { //  '/'= indexfilen i localhost/products/   req = request , res= resultat , next = det som ska hända senare 
    const uppgift={ //skapar ett objekt.
        name: req.body.name,
        steg: req.body.headlines.length,
        headlines: req.body.headlines,
        texts: req.body.texts
    }

    if(req.body.name==null){ //om det inte finns något namn i bodyn så vet vi att det är [] ivägen för innehållet därav är måsste vi veta det och ändra produktens namn och pris
        //Förklaring till raden ovan, är det bra direkt så är koden {name: "Exempel", price: "13"} är den inte bra så är den [{name: "Exempel", price: "13"}] alltså är det en lista med ett objekt i.
        uppgift.name= req.body[0].name; 
        uppgift.steg= req.headlines[0].length; 
        uppgift.texts= req.body[0].texts; 
        uppgift.headlines= req.body[0].headlines;
    }
    console.log(req.body); //Här skriver jag ut req.body för att se skillnaden på den mellan en postman request och en html.
      UpdateUppgiftcount(uppgift.steg,uppgift.name);

     CreateAssignment(uppgift.name).then( nutt => {
        PopulateAssignment(uppgift.name, uppgift.headlines,uppgift.texts);
        res.status(200).json({ //Här kan man som jag gjort lägga till en status 200, OBS tänk på att 201 kommer
         message: "Success, new assignment created",// nästan aldrig köras då, så bästa är att ändra till 201 i din frontEnd eller 201 här i backend.
 });

 }).catch(err => {
     res.status(500).json({
         error: err
     });
 });


});

router.patch('/:name', (req, res, next) => { 
    const uppgift={ //skapar ett objekt.
        steg: req.body.steg,
        formersteg: req.body.formersteg,
        name: req.params.name,
        yourname: req.body.yourname
    }
console.log(uppgift);
StatusLogger.CreateStatusPost(uppgift.name,uppgift.yourname,"none",uppgift.steg).then(UpdateStudentOnAssignment(uppgift.name,uppgift.steg,uppgift.formersteg,uppgift.yourname)).then( response => {

       console.log(response);
        res.status(201).json({
         message: "Success, Steg updated,"+uppgift.steg+" for"+uppgift.yourname+ " in "+ uppgift.name,
 });

 }).catch(err => {
     console.log(err);
     res.status(500).json({
         error: err
     });
 });
});

router.patch('/', (req, res, next) => { //  '/'= indexfilen i localhost/products/   req = request , res= resultat , next = det som ska hända senare 
    const uppgift={ //skapar ett objekt.
        name: req.body.name,
        steg: req.body.headlines.length,
        headlines: req.body.headlines,
        texts: req.body.texts
    }

    if(req.body.name==null){ //om det inte finns något namn i bodyn så vet vi att det är [] ivägen för innehållet därav är måsste vi veta det och ändra produktens namn och pris
        //Förklaring till raden ovan, är det bra direkt så är koden {name: "Exempel", price: "13"} är den inte bra så är den [{name: "Exempel", price: "13"}] alltså är det en lista med ett objekt i.
        uppgift.name= req.body[0].name; 
        uppgift.steg= req.headlines[0].length; 
        uppgift.texts= req.body[0].texts; 
        uppgift.headlines= req.body[0].headlines;
    }
    console.log(req.body); //Här skriver jag ut req.body för att se skillnaden på den mellan en postman request och en html.
   

   
    UpdateUppgiftcount(uppgift.steg,uppgift.name);

    GetOldValues(uppgift.name+"uppgift", "Id").then( id => {

        var ids= id.length;
             deluppgifter=uppgift.headlines.length;
             plusminus= deluppgifter-ids;

        UpdateAssignment(uppgift.name, uppgift.headlines,uppgift.texts,id);
        if (plusminus>0) {
            var delheadlines= uppgift.headlines.splice(deluppgifter-plusminus,deluppgifter);
            var deltexts= uppgift.texts.splice(deluppgifter-plusminus,deluppgifter);
            PopulateAssignment(uppgift.name, delheadlines,deltexts);       
        }
        else if(plusminus<0)
        {
            let start=ids-deluppgifter;
            let midpoint= ids-start;

            var deltexts=  id.splice(midpoint,ids);
            RemoveAssignment(uppgift.name+"uppgift" ,deltexts);
        }
         
        res.status(201).json({
         message: "Success, assignment updated",
 });

 }).catch(err => {
     console.log(err);
     res.status(500).json({
         error: err
     });
 });


});

module.exports= router;
