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


apiRouter.get(endpoint + 'animal', (req, res) => {
    knex.select('*').from('animal.animal')
    .then( animal => res.status(200).json(animal) )
    .catch(err => {
    res.status(500).json({
    message: 'Erro ao recuperar animais - ' + err.message })
    })
})

apiRouter.get(endpoint + 'animal/:id', (req, res) => { 
    const id = parseInt(req.params.id);
    knex('animal')
        .then(animal => {
            const idx = animal.findIndex(p => p.id === id);
            res.status(200).json(animal[idx]);
        })
        .catch(err => {
            res.status(500).json({
                message: 'Um erro ocorreu: ' + err.message,
            });
        });

})

apiRouter.post(endpoint + 'animal', (req, res) => { 
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

apiRouter.put(endpoint + 'animal/:id', (req, res) => {
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

apiRouter.delete(endpoint + 'animal/:id', (req, res) => {
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

module.exports = apiRouter;