
require("dotenv").config();

const {v4 : uuidV4} = require('uuid');
const nodemailer = require('nodemailer');
const {mongoClient} = require('../config/db.config.js');
const {redisClient} = require('../config/redis.config.js');
const {sendResp} = require('../middlewares/common-utils.js');
const constants = require('../middlewares/constatns.json');

const userDB = mongoClient.db("codenest").collection("users");

const LOGIN_TTL = process.env.LOGIN_TTL;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rohithyalagam2001@gmail.com', // Your email address
        pass: 'kaitxyyqxdqrzrye' // Your password for the email address
    }
});

let mailOptions = {
    from: 'cses@rohith.com', // Sender address
    to: 'rohithyelagam@gmail.com', // List of recipients
    subject: 'Test Email', // Subject line
    html: '<b>Hello world!</b>' // HTML body
};

const userLogin = async (req,res)=>{

    try{
    
        const user = req.body;

        const loginFlg = await validateUser(user);

        if(!loginFlg){
            sendResp(res,"user does not exists!",constants.FAILURE,400);
            return;
        }

        const token = await addRedisUser(user);

        sendResp(res,token,constants.SUCESS,200);
    }catch(err){
        sendResp(res,err.message,constants.ERROR,500);
    }
}

const userLogout = async (req,res)=>{
    try{

        const user = req.body;

        removeRedisUser(user);

        sendResp(res,"User Logged Out.",constants.SUCESS,200);
    }catch(err){
        sendResp(res,err.message,constants.ERROR,500);
    }
}

const forgotPswd = async (req,res)=>{

    try{

        const user = await userDB.findOne({email:req.body.email});

        if(user==null || user==undefined){
            sendResp(res,"User Does Not Exists!",constants.FAILURE,400);
            return;
        }

        mailOptions.to = user.email;
        mailOptions.subject = 'Forgot Password';
        mailOptions.html = `<b>Please find the password below : </br> <h2>${user.password}</h2></b>`;

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
        });
        sendResp(res,"Mail Sent Sucessfully",constants.SUCESS,200);

    }catch(err){
        sendResp(res,err.message,"INTERNAL_ERR",500);
    }
}

const userRegister = async (req,res)=>{

    try{
        console.log("userRegister started.");

        const user = req.body;

        const result = await userDB.findOne({email:user.email});
    
        if(result!=null){
            sendResp(res,"User alredy exists!",constants.FAILURE,400);
        }else{
            const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

            mailOptions.to = user.email;
            mailOptions.subject = 'Registration OTP';
            mailOptions.html = `<b>Please find the OTP to Register </br> <h2>${otp}</h2></b>`;

            await transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
            });
            await redisClient.set(`REG_OTP_${user.email}`,JSON.stringify({user:user,otp:otp}));
            await redisClient.expire(`REG_OTP_${user.email}`,300);
            sendResp(res,"OTP sent sucessfully","OK",200);
        }

        console.log("userRegister ended");
    }catch(err){
        sendResp(res,err.message,constants.ERROR,500);
    }
    
}

const validateOTP = async (req,res)=>{

    try{
        const userId = req.body.userId;
        const otp = req.body.otp;

        var data = await redisClient.get(`REG_OTP_${userId}`);

        if(data!=null){
            data = JSON.parse(data);
            if(data.otp == otp){
                await userDB.insertOne(data.user);
                await addRedisUser(data.user);
                await sendResp(res,"User Registered Sucessfully.",constants.SUCESS,200);
            }else{
                sendResp(res,"Invalid OTP","OK",400);
            }
        }else{
            sendResp(res,"User does not exists!","OK",400);
        }
    }catch(err){
        sendResp(res,err.message,constants.ERROR,500);
    }

}

const validateToken = async (req,res)=>{

    try{
        const token = req.body.token;

        const data = await redisClient.exists(token);
        
        if(data){
            sendResp(res,true,"OK",200);
        }else{
            sendResp(res,false,"OK",400);
        }
    }catch(err){
        sendResp(res,err.message,constants.ERROR,500);
    }

}

const addRedisUser = async (user)=>{
    const email = user.email;
    const existingToken = await redisClient.get(email);
    if(existingToken!=null){
        await redisClient.del(existingToken);
    }
    const newToken = uuidV4();
    await redisClient.set(newToken,JSON.stringify(user),{ EX:LOGIN_TTL });
    await redisClient.set(email,newToken,{ EX:LOGIN_TTL });
    return newToken;
}

const removeRedisUser = async (user)=>{
    const email = user.email;
    const existingToken = await redisClient.get(email);
    if(existingToken!=null){
        await redisClient.del(existingToken);
        await redisClient.del(email);
    }
}

const validateUser = async (user)=>{
    const email = user.email;
    const pswd = user.password;
    const existingUser = await userDB.findOne({email:email,password:pswd});
    if(existingUser==null || existingUser==undefined){
        return false;
    }else{
        return true;
    }
}



module.exports = {userLogin,userLogout,forgotPswd,userRegister,validateOTP,validateToken};
