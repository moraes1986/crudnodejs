require ('dotenv').config()

// Importa o módulo do Express Framework
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')

// Inicializa um objeto de aplicação Express
const app = express()

app.use (morgan('common'))
app.use (helmet())

//---------------------------------------------- Client
app.use('/blog', express.static('public'))


//---------------------------------------------- Site Template
app.set('view engine', 'ejs')
app.set('views', './views')
app.get('/site', (req, res) => {
    res.status(200).render('index', dados)
})

const apiRouter = require('./routes/apiRouter.js')
app.use('/api/v2', apiRouter)

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
