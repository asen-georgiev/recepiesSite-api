const express = require ("express");
const app = express();
const winston = require("winston");


require('dotenv').config();
require('./startup/db')();
require('./startup/cors')(app);
require('./startup/routes')(app);


const port = process.env.PORT || 3900;
const server = app.listen(port,()=>winston.info(`Listening for recepiesSite-api on port: ${port}`));

module.exports = server;
