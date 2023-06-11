const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
dotenv.config();
const app = express();

// Connect to DB
const start = async()=> {
    try {
        await mongoose.connect(process.env.CONN,  { useNewUrlParser: true, useUnifiedTopology: true });
        
            console.log('CONNECTED');

        
    }

 catch (e) {
    console.log(e.message);
 }
};

module.exports = {
    start,
    connection: mongoose.connection,
  };