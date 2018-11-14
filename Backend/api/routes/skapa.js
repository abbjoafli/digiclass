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



//Skapa ny användare//Uppdatera så den väljer en befintlig om den finns o annars skapar en ny.
router.post('/:ClassName', (req, res, next) => { //  '/'= indexfilen i localhost/products/   req = request , res= resultat , next = det som ska hända senare 
 
req.params.ClassName= req.params.ClassName.toLowerCase();
    if(req.body.name==null){ //om det inte finns något namn i bodyn så vet vi att det är [] ivägen för innehållet därav är måsste vi veta det och ändra produktens namn och pris
        //Förklaring till raden ovan, är det bra direkt så är koden {name: "Exempel", price: "13"} är den inte bra så är den [{name: "Exempel", price: "13"}] alltså är det en lista med ett objekt i.
        req.body.name= req.body[0].name; //Vi tar första objektet(enda på det sättet vi lagt upp koden nu) och använder dess namn
    }
    let Mess='';
    let Studentcount=0;
    var Getinfo = function () {
        return new Promise(function(resolve,reject) {
 
            con.query('SELECT `Meddelande`, `StudentCount` FROM `klasser` WHERE `Name` = ?',[[req.params.ClassName]], function(err,result) {
      
                if(result.length == 0) {
                    res.status(200).json({message: "Failure"}); 
               }
               else{
                    if(err){                
                        return reject(err);
                    }else{              
                        return resolve(result);
                    }
                }
                }); // query
              }); // Promise
            } // getDepartments

    var createStudent = function(){ //Skapar funktionen
        return new Promise(function(resolve,reject){ //Skapar löftet


             Getinfo().then( fromDB => {
                Mess= fromDB[0].Meddelande;
            Studentcount= fromDB[0].StudentCount;
            Studentcount= Studentcount+1;
            let query='INSERT INTO '+req.params.ClassName +' (Namn, inloggad) VALUES (?)';
            let inputs= [req.body.name,1];
          

            if (Mess!='') {
                query='INSERT INTO '+req.params.ClassName +' (Namn,inloggad,Meddelandefrom) VALUES (?)';
                inputs= [req.body.name,1,Mess];// behövs bara ett frågetecken när det är i samma objekt!!
            }
            con.query(query,[inputs], function(err,result) {

              if(err){                
                  return reject(err);
              }else{         
                  return resolve(result);
              }
      
          });
        }); // query
        }); // Promise
      } // getDepartments

      createStudent().then( result => {
        con.query('UPDATE `klasser`  SET `StudentCount` = ?   WHERE `Name` = ?',[[Studentcount],[req.params.ClassName]], function(err,result) {
            if(err){                
                console.log(err);
            }else{              
                console.log(result);
            }
        }); // query

        res.status(200).json({message: "Success"}); 
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

//Skapar ny klass och lägger in i lärarklass
router.post('/', (req, res, next) => { //  '/'= indexfilen i localhost/products/   req = request , res= resultat , next = det som ska hända senare 
    const product={ //skapar ett objekt.
        name: req.body.name,
        password: req.body.pass
    }

    if(req.body.name==null){ //om det inte finns något namn i bodyn så vet vi att det är [] ivägen för innehållet därav är måsste vi veta det och ändra produktens namn och pris
        //Förklaring till raden ovan, är det bra direkt så är koden {name: "Exempel", price: "13"} är den inte bra så är den [{name: "Exempel", price: "13"}] alltså är det en lista med ett objekt i.
    product.name= req.body[0].name; 
    product.password= req.body[0].pass; 
    }
    console.log(req.body); //Här skriver jag ut req.body för att se skillnaden på den mellan en postman request och en html.
    var Addteacher = function(){ //Skapar funktionen
        return new Promise(function(resolve,reject){ //Skapar löftet
            //[[ value]] , [[ [product.name,product.price]]] 
            var Theproduct = [product.name,product.password];
            console.log(Theproduct);
            con.query('INSERT INTO klasser (Name, Password) VALUES (?,?)',Theproduct, function(err,result) {
             if(err){          
                 console.log(err);      
                  return reject(err);
              }else{              
                  return resolve(Theproduct);
              }
      
          });
        });
      } 

      var CreateClassroom = function(){ //Skapar funktionen
        return new Promise(function(resolve,reject){ //Skapar löftet
            //[[ value]] , [[ [product.name,product.price]]] 
            con.query('CREATE TABLE '+product.name+'  ( PersonID int UNSIGNED AUTO_INCREMENT PRIMARY KEY, Namn varchar(255) NOT NULL UNIQUE,  Status varchar(255), Meddelande varchar(255), Meddelandefrom varchar(255), Time TIMESTAMP, inloggad boolean not null default 0, steg int not null default 0 );'
         , function(err,result) {
              if(err){                
                  return reject(err);
              }else{              
                  return resolve(result);
              }
      
          });
        });
      } 


    Addteacher().then( Theproduct => {
        console.log(Theproduct);
        res.status(200).json({ //Här kan man som jag gjort lägga till en status 200, OBS tänk på att 201 kommer
            message: "Success, new product created",// nästan aldrig köras då, så bästa är att ändra till 201 i din frontEnd eller 201 här i backend.
    });
        
    }).catch(err => {
        res.status(500).json({
            error: err,
            message:"HEJ"
        });
    });

     CreateClassroom();


});

router.get('/:ClassName', (req, res, next) => {
 
    //req.body.name Skillnad = body tar det från kroppen medans params tar det från sökfältet
const ClassName = req.params.ClassName.toLowerCase();
var getProduct = function(){
return new Promise(function(resolve,reject){

con.query("SELECT * FROM klasser  Where `Name` = ?",ClassName, function (err, result, fields) {

if(err){                
  return reject(err);
}else{              
  return resolve(result);
}

}); // query
}); // Promise
} // getDepartments

getProduct().then( result => {
if(result.length!=0)
res.status(200).json(result);
else
res.status(404).json({message: 'No such value exist'});

}).catch(err => {
res.status(500).json({
error: err
});
});

});


router.delete('/:productName', (req, res, next) => {


    var RemoveProduct = function(){
        return new Promise(function(resolve,reject){
            const Name = req.params.productName;
            con.query("DELETE FROM products WHERE `name` = ?", [Name], function (err, result, fields) {
      
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

module.exports= router;


