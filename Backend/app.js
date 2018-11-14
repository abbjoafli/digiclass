const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const skapaRoutes= require('./api/routes/skapa');
const elevRoutes= require('./api/routes/elev');
const larareRoutes= require('./api/routes/larare');
const uppgRoutes= require('./api/routes/uppgifter');
const helpRoutes= require('./api/routes/help');
const boardRoutes= require('./api/routes/board');
var cors = require('cors');
app.use((req, res, next) => {
       // Website you wish to allow to connect
       res.setHeader('Access-Control-Allow-Origin', '*');

       // Request methods you wish to allow
       res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
   
       // Request headers you wish to allow
       //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
       res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
       // Set to true if you need the website to include cookies in the requests sent
       // to the API (e.g. in case you use sessions)
       res.setHeader('Access-Control-Allow-Credentials', true);
   
       // Pass to next layer of middleware
   
    next();
});

app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use('/skapa', skapaRoutes);
app.use('/larare', larareRoutes);
app.use('/elev', elevRoutes);
app.use('/uppgifter', uppgRoutes);
app.use('/help', helpRoutes);
app.use('/board', boardRoutes);


app.use((req, res, next) => {
    const error = new Error('Not found.');
    error.status= 404;
    next(error);
});

app.use((error,req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports= app;
