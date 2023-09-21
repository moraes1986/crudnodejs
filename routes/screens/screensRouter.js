const express = require ('express');
const screensRouter = express.Router();
const fs = require("fs");

screensRouter.get("/", (req,res) =>{
    const path = require('path').resolve(__dirname, './statics/list-animals.html');
    const file = fs.readFileSync(path,  { encoding: 'utf8'})
    res.status(200).send(file);
})

module.exports = screensRouter