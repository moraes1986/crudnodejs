const express = require ('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

apiRouter.post(endpoint + 'seguranca/login', (req, res) => {
    knex
        .select('*').from('public.usuario').where( { login: req.body.login })
        .then( usuarios => {
            if(usuarios.length){
                let usuario = usuarios[0]
                let checkSenha = bcrypt.compareSync (req.body.senha, usuario.senha)
                if (checkSenha) {
                    var tokenJWT = jwt.sign({ id: usuario.id },
                    process.env.SECRET_KEY, {
                        expiresIn: 3600
                    })
                res.status(200).json ({
                    id: usuario.id,
                    login: usuario.login,
                    nome: usuario.nome,
                    roles: usuario.roles,
                    token: tokenJWT
                })
                return
            }
        }
        
        res.status(200).json({ message: 'Login ou senha incorretos' })
    })
    .catch (err => {
        res.status(500).json({
            message: 'Erro ao verificar login - ' + err.message })
    })
})

let checkToken = (req, res, next) => {
    let authToken = req.headers["authorization"]
    if (!authToken) {
        res.status(401).json({ message: 'Token de acesso requerida' })
    }
    else {
        let token = authToken.split(' ')[1]
        req.token = token
    }

    jwt.verify(req.token, process.env.SECRET_KEY, (err, decodeToken) => {
        if (err) {
            res.status(401).json({ message: 'Acesso negado'})
            return
        }
    req.usuarioId = decodeToken.id
    next()
    })
}

let isAdmin = (req, res, next) => {
    knex
        .select ('*').from ('public.usuario').where({ id: req.usuarioId })
        .then ((usuarios) => {
            if (usuarios.length) {
                let usuario = usuarios[0]
                let roles = usuario.roles.split(';')
                let adminRole = roles.find(i => i === 'ADMIN')
                if (adminRole === 'ADMIN') {
                    next()
                    return
                }
                else {
                    res.status(403).json({ message: 'Role de ADMIN requerida' })
                    return
                }
            }
        })
        .catch (err => {
            res.status(500).json({
                message: 'Erro ao verificar roles de usuário - ' + err.message })
        })
}

                    
apiRouter.get(endpoint + 'animal', checkToken, (req, res) => {
    knex.select('*').from('animal.animal')
    .then( animal => res.status(200).json(animal) )
    .catch(err => {
    res.status(500).json({
    message: 'Erro ao recuperar animais - ' + err.message })
    })
})

apiRouter.get(endpoint + 'animal/:id', checkToken, (req, res) => { 
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

apiRouter.post(endpoint + 'animal', checkToken, isAdmin, (req, res) => { 
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

apiRouter.put(endpoint + 'animal/:id', checkToken, isAdmin, (req, res) => {
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

apiRouter.delete(endpoint + 'animal/:id', checkToken, isAdmin, (req, res) => {
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

// # Registro de Usuário
apiRouter.post (endpoint + 'seguranca/register', (req, res) => {
    knex ('usuario')
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