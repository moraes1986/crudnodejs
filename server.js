require ('dotenv').config()

// Importa o módulo do Express Framework
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')

// Inicializa um objeto de aplicação Express
const app = express()

app.use (morgan('common'))
app.use (helmet())

const cors = require('cors')
app.use(cors());

//---------------------------------------------- Client
app.use('/blog', express.static('public'))


//---------------------------------------------- Site Template
const screensRouter = require('./routes/screens/screensRouter.js')
app.use('/site', screensRouter)

const apiRouter = require('./routes/apiRouter.js')
app.use('/api/v2', apiRouter)

const apiV1Router = require('./routes/apiV1Router.js')
app.use('/api', apiV1Router)

const apiSegRouter = require('./routes/apiSegRouter.js')
app.use('/api/seg',apiSegRouter)


//---------------------------------------------- Form Teste
// Cria um manipulador da rota padrão 
app.get('/', (req, res) => 
    res.send(`<form method="POST">
                 Nome: <input type="text" name="nome">
                 <input type="submit" value="Ok">
            </form>`)
)

// processar o corpo da requisição e colocar os dados em req.body
app.use
app.post('/', (req, res) => {
    res.send(`Seja bem vindo ${req.body.nome}`)
})

app.use((req, res) => {
    res.status(404).send('Página não encontrada')
})

// Inicializa o servidor HTTP na porta 3000
app.listen(3000, function () {
    console.log('Servidor rodando na porta 3000')
})
