const express = require ('express')

const knex = require('knex')({
    client: 'pg',
    debug: true,
    connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    }
});

let apiV1Router = express.Router()
const endpoint = '/'


apiV1Router.get(endpoint + 'animal', (req, res) => {
    knex.select('*').from('animal.animal')
    .then( animal => res.status(200).json(animal) )
    .catch(err => {
    res.status(500).json({
    message: 'Erro ao recuperar animais - ' + err.message })
    })
})

apiV1Router.get(endpoint + 'animal/:id', (req, res) => { 
    const id = parseInt(req.params.id);
    knex.select('*').from('animal.animal').where('id',id)
        .then(animal => {
            res.status(200).json(animal);
        })
        .catch(err => {
            res.status(500).json({
                message: 'Um erro ocorreu: ' + err.message,
            });
        });

})

apiV1Router.post(endpoint + 'animal', (req, res) => { 
    const { descricao, preco, raca } = req.body;
    knex('animal')
        .insert({ descricao, preco, raca })
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            res.status(500).json({
                message: 'Um erro ocorreu: ' + err.message,
            });
        });
})

apiV1Router.put(endpoint + 'animal/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { descricao, preco, raca } = req.body;
    knex('animal')
        .where('id', id)
        .update({ descricao, preco, raca })
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                message: 'Um erro ocorreu: ' + err.message,
            });
        });
 })

apiV1Router.delete(endpoint + 'animal/:id', (req, res) => {
    const id = parseInt(req.params.id);
    knex('animal')
        .where('id', id)
        .del()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                message: 'Um erro ocorreu: ' + err.message,
            });
        });
})

module.exports = apiV1Router;