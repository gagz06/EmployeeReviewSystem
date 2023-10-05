const express = require('express');
const app = express();
const port = 8000;

const expressLayouts = require('express-ejs-layouts');

app.use(express.urlencoded({extended:false}));
app.use(expressLayouts);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.use('/', require('./routes'));
app.listen(port,function(err){
    if(err){
        console.log(err);
    }
    console.log(`Server running at port: ${port}`);
});