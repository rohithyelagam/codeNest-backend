
const {redisClient} = require('../config/redis.config.js');
const { sendResp } = require('./common-utils');
const constants = require('./constatns.json');

const validateReq = async (req,res,next)=>{

    const token = req.header('token');

    if(token==null || token == undefined){
        sendResp(res,"Unauthorized Request",constants.FAILUE,400);
        return;
    }

    const userToken = await redisClient.get(token);

    if(userToken==null || userToken==undefined){
        sendResp(res,"User Login expried",constants.FAILUE,400);
        return;
    }
    next();
}

module.exports = {validateReq};