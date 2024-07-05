const express = require('express');
const { validateReq } = require('../middlewares/authentication');
const {searchProblem,getProblem,submitProblem,runCode,getSubmissions,getTestCases} = require('../controller/csesController');

const csesRouter = express.Router();

csesRouter.use('',validateReq);

csesRouter.post('/search',searchProblem);
csesRouter.post('/getProblem',getProblem);
csesRouter.post('/getTestCases',getTestCases);
csesRouter.post('/runCode',runCode);
csesRouter.post('/submitProblem',submitProblem);
csesRouter.post('/getSubmissions',getSubmissions);

module.exports = csesRouter;