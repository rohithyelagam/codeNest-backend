const {MongoClient, ServerApiVersion} = require('mongodb');
const {listDatabases} = require("mongoose");

require("dotenv").config();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;

const uri = `mongodb+srv://${username}:${password}@${host}/?appName=codenest`;

const mongoClient = new MongoClient(uri, {
    serverApi :{
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

const connectDB = async ()=>{
    console.log("connecting database");
    await mongoClient.connect();
    console.log("You successfully connected to MongoDB!");
}

module.exports = {connectDB,mongoClient};