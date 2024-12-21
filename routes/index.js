const express = require('express');
const userRouter = require('./user.routes');



const apiRouter = express.Router();

apiRouter.use("/users",userRouter);

module.exports = apiRouter;