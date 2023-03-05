const express = require("express");
const dotenv = require("dotenv").config();
const { Liquid } = require('liquidjs');


const app = express();

//to use for css , javascript and other static files
app.use(express.static(__dirname + "/public")); 
app.use(express.urlencoded({ extended : true }));
app.use(express.json()); //to use json in response

const engine = new Liquid();
// register liquid engine
app.engine('liquid', engine.express()); 
app.set('views', './views');            // specify the views directory
app.set('view engine', 'liquid');       // set liquid to default

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
    console.log("Hi");
    res.send("Hi");
}); 


const contactRoutes = require('./routes/contacts');
app.use('/contacts', contactRoutes);

app.listen(PORT);