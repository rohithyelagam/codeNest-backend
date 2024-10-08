const express = require('express');
const {json, urlencoded} = require('express');
const cors = require('cors');

const {connectDB}  = require('./config/db.config.js');
const {connectRedis} = require('./config/redis.config.js');
const indexRouter = require("./routes/index.js");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

app.use('/codenest',indexRouter);

const port = process.env.PORT || 4000;

const start = async ()=>{

    await connectRedis();

    await connectDB();
    
    await new Promise((res)=>{app.listen(port,()=>{
        console.log("CodeNest-Backend is Online!\nService Running at Port : "+port);
        res();
    })})
}


start();