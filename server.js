require ('dotenv').config()

// Importa o módulo do Express Framework
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')

const bodyParser = require('body-parser');

// Inicializa um objeto de aplicação Express
const app = express()
app.use(bodyParser.urlencoded({
    extended: true
  }))
app.use(bodyParser.json({strict: false}))
app.use (morgan('common'))
app.use (helmet())

const cors = require('cors')
app.use(cors());

const apiRouter = require('./routes/apiRouter.js')
app.use('/api/v2', apiRouter)

const apiSegRouter = require('./routes/apiSegRouter.js')
app.use('/api/seg',apiSegRouter)

const screensRouter = require('./routes/screens/screensRouter.js')
app.use('/', screensRouter)

app.use((req, res) => {
    res.status(404).send('Página não encontrada')
})

// Inicializa o servidor HTTP na porta 3000
app.listen(3000, function () {
    console.log('Servidor rodando na porta 3000')
})
