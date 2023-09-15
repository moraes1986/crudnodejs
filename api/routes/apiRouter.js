const express = require ('express')

const knex = require('knex')({
    client: 'pg',
    debug: true,
    connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    }
});

let apiRouter = express.Router()
const endpoint = '/'
const lista_produtos = {
    produtos: [
        { id: 1, descricao: "Produto 1", valor: 5.00, marca: "marca " },
        { id: 2, descricao: "Produto 2", valor: 5.00, marca: "marca " },
        { id: 3, descricao: "Produto 3", valor: 5.00, marca: "marca " },
    ]
}

apiRouter.get(endpoint + 'animal', (req, res) => {
    knex.select('*').from('animal')
    .then( animal => res.status(200).json(animal) )
    .catch(err => {
    res.status(500).json({
    message: 'Erro ao recuperar animais - ' + err.message })
    })
})

apiRouter.get(endpoint + 'animal/:id', (req, res) => { })
apiRouter.post(endpoint + 'animal', (req, res) => { })
apiRouter.put(endpoint + 'animal/:id', (req, res) => { })
apiRouter.delete(endpoint + 'animal/:id', (req, res) => {})
module.exports = apiRouter;