const express = require("express");
const dotenv = require("dotenv").config();
//const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const { Liquid } = require('liquidjs');

const app = express();

//to use for css , javascript and other static files
app.use(express.static(__dirname + "/public")); 
app.use(express.urlencoded({ extended : true }));
app.use(express.json()); //to use json in response
//app.use(cookieParser()); //using cookies in our application

// register liquid engine
const engine = new Liquid();
app.engine('liquid', engine.express()); 
app.set('views', './views');            // specify the views directory
app.set('view engine', 'liquid');       // set liquid to default

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {

    //let token = jwt.sign({myname : 'dmitri'}, process.env.SECRET_KEY);
    //console.log(token);
    //res.cookie('username', 'Dmitri', { httpOnly : true, maxAge : 900000 } ); //15 minutes expiration in milleseconds    
    res.send("Hi");
}); 

//contact pages
const contactRoutes = require('./routes/contacts');
app.use('/contacts', contactRoutes);

//medication pages
const medicationRoutes = require('./routes/medication');
app.use('/medication', medicationRoutes);

const rationRoutes = require('./routes/ration');
app.use('/ration', rationRoutes);






app.listen(PORT);