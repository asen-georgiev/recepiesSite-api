const express = require ("express");
const app = express();
const winston = require("winston");


const port = process.env.PORT || 3900;
const server = app.listen(port,()=>winston.info(`Listening for recepiesSite-api on port: ${port}`));

module.exports = server;
