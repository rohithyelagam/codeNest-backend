const express = require('express');
const authRouter =require("./auth.js");
const csesRouter = require('./cses.js');

const indexRouter = express.Router();

indexRouter.use('/auth', authRouter);
indexRouter.use('/cses', csesRouter);

module.exports = indexRouter;
