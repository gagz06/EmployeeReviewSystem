const express = require('express');
const env = require('./config/environment');
const app = express();
const port = 8000;
const db=require('./config/mongoose');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const mongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMware = require("./config/middleware");

app.use(session({
    name:'ers',
    secret: 'xyz',
    saveUninitialized: false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store:  mongoStore.create(
    {
        //instead of new MongoStore we used create as it's depricated
        mongoUrl: process.env.MONGODB_CONNECT_URI,
        autoRemove: 'disabled'
    },
    function(err){
        console.log(err|| 'connect-mongodb setup ok');
    }
    )
}));

app.use(express.urlencoded({extended:false}));
app.use(expressLayouts);
app.use(express.static(env.asset_path));
app.use(cookieParser());
app.use('/uploads',express.static(__dirname+'/uploads'));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

app.use('/', require('./routes'));
app.listen(port,function(err){
    if(err){
        console.log(err);
    }
    console.log(`Server running at port: ${port}`);
});