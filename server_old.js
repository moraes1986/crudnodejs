require('dotenv').config()

const express = require ('express')
const cors = require('cors');
const path = require ('path')
const app = express ()
const apiRouter = require('./routes/apiRouter')

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use ('/api', apiRouter)

app.use('/app', express.static (path.join (__dirname, '/public')))

const PORT = process.env.PORT || 3000

app.listen (PORT, function() {
    console.log('Servidor rodando na porta 3000')
})