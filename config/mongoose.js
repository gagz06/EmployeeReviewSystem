
const mongoose = require('mongoose');
//const dev = require('./environment');
require("dotenv").config();
//mongoose.connect(`mongodb://localhost/${env.db}`);
//mongoose.connect(`mongodb://127.0.0.1/${dev.db}`);
mongoose.connect(process.env.MONGODB_CONNECT_URI);

const db =mongoose.connection;

db.on('error',console.error.bind(console,"Error connecting to db"));

db.once('open',function(){
    console.log('Connected to db:MongoDB');
});

module.exports=db;