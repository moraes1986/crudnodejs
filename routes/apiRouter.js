const express = require ('express')
const apiRouter = express.Router()

const knexConfig = require('../knexfile.js')[process.env.NODE_ENV]
const knex = require('knex')(knexConfig)

const { checkToken, isAdmin } = require('./apiSegRouter.js')

apiRouter.use(express.json())
apiRouter.get('/animals', checkToken, (req, res) => {
    knex('animal.animal')
        .then( animal => { 
            res.status(200).json(animal) 
        })
        .catch(err => {
            res.status(500).json({
                message: `Erro ao recuperar animais do database:  ${err.mensage}` 
            })
        })
})

apiRouter.get('/animal/:id', checkToken, (req, res) => { 
    const id = parseInt(req.params.id);
    knex('animal.animal')
        .where('id',id)
        .then(animal => {
            res.status(200).json(animal);
        })
        .catch(err => {
            res.status(500).json({
                message: 'Um erro ocorreu: ' + err.message,
            });
        });

})

apiRouter.post('/animal', checkToken, isAdmin, (req, res) => { 
    const { descricao, preco, raca } = req.body;
    knex('animal.animal')
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

apiRouter.put('/animal/:id', checkToken, isAdmin, (req, res) => {
    const id = parseInt(req.params.id);
    const { descricao, preco, raca } = req.body;
    knex('animal.animal')
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

apiRouter.delete('/animal/:id', checkToken, isAdmin, (req, res) => {
    const id = parseInt(req.params.id);
    knex('animal.animal')
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

// # Registro de Usuário
apiRouter.post ('/register', checkToken, isAdmin, (req, res) => {
    knex ('public.usuario')
        .insert({
            nome: req.body.nome,
            login: req.body.login,
            senha: bcrypt.hashSync(req.body.senha, 8),
            email: req.body.email
        }, ['id'])
        .then((result) => {
            
            let usuario = result[0]
            res.status(200).json({"id": usuario.id })
            return
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao registrar usuario - ' + err.message })
        })
})
module.exports = apiRouter;