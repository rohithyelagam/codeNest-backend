const redis = require('redis');

require("dotenv").config();

const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;
const pswd = process.env.REDIS_PSWD;

const redisClient = redis.createClient({
    password: pswd,
    socket: {
        host: host,
        port: port
    }
})

const connectRedis = async ()=> {
    console.log("conneccting to redis");
    await redisClient.connect();
    console.log("connected to redis");
}

module.exports = {connectRedis,redisClient};
