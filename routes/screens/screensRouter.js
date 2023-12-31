const express = require ('express');
const screensRouter = express.Router();
const fs = require("fs");
const { checkToken } = require('../apiSegRouter.js')

screensRouter.use('/', (req, res, next)=>{
    res.set('Content-Security-Policy', "default-src * 'unsafe-inline' 'unsafe-eval';")
    next()
})

screensRouter.get("/", checkToken,  (req,res) =>{
    const path = require('path').resolve(__dirname, './statics/list-animals.html');
    const file = fs.readFileSync(path,  { encoding: 'utf8'})
    res.status(200).send(file);
})

module.exports = screensRouter