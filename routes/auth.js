const express = require('express');
const { userLogin, userLogout, userRegister, forgotPswd, validateOTP, validateToken } = require("../controller/authController");
const { validateReq } = require('../middlewares/authentication');

const authRouter = express.Router();

authRouter.use('/v1/logout',validateReq);

authRouter.post('/v1/login',userLogin);
authRouter.post('/v1/logout',userLogout);
authRouter.post('/v1/register',userRegister);
authRouter.post('/v1/forgot',forgotPswd);
authRouter.post('/v1/validateOtp',validateOTP);
authRouter.post('/v1/validateToken',validateToken);

module.exports = authRouter;