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

//home route //controller
const homeController = require('./controllers/home/homeController');

app.get('/', homeController.getIndex);

// app.get("/", (req, res) => {

//     res.status(200).render('home/index', {});
//     //let token = jwt.sign({myname : 'dmitri'}, process.env.SECRET_KEY);
//     //console.log(token);
//     //res.cookie('username', 'Dmitri', { httpOnly : true, maxAge : 900000 } ); //15 minutes expiration in milleseconds    
    
    
//     //res.send("Hi");
// }); 


//contact pages
const contactRoutes = require('./routes/contacts');
app.use('/contacts', contactRoutes);

//medication pages
const medicationRoutes = require('./routes/medication');
app.use('/medication', medicationRoutes);

//feed rations
const rationRoutes = require('./routes/ration');
app.use('/ration', rationRoutes);

//inventory
const inventoryRoutes = require('./routes/inventory');
app.use('/inventory', inventoryRoutes);

//accounting
const accountingRoutes = require('./routes/accounting');
app.use('/accounting', accountingRoutes);




app.listen(PORT);