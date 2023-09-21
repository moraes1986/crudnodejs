const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const express = require ('express')
const { token } = require('morgan')
const apiSegRouter = express.Router()

const knexConfig = require('../knexfile.js')[process.env.NODE_ENV]
const knex = require('knex')(knexConfig)

apiSegRouter.use(express.json())

apiSegRouter.post('/login', (req, res) => {
    const {login, senha } = req.body

    knex('public.usuario')
        .where( { "login": login })
        .then( usuarios => {
            if(! usuarios.length)
                res.status(401).json ({ message: `Usuário ou senha incorretos!`})
            else {
                let usuario = usuarios[0]
                bcrypt.compare(senha, usuario.senha, (err, result)=> {
                    if(err)
                        res.status(500).json ({ message: `Erro ao cmparar senhas: ${err.message}`})
                    else if (result) {
                        jwt.sign({ id: usuario.id, roles: usuario.roles}, process.env.SECRET_KEY,
                            { algorithm: "HS256", expiresIn: '1h'}, (err, token) => {
                                if (err)
                                    res.status(500).json({ message: `Erro ao gerar token ${err.message}`})
                                else
                                    res.status(200).json ({ token: token})
                            })
                    }
                    else
                        res.status(401).json({ message: `Usuário ou senha incorretos! `})
                })
            }
        })
    
})

apiSegRouter.checkToken = (req, res, next) => {
    next()
    // const authHeader = req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1]

    // if (!token)
    //     res.status(401).json({ message: `Token de acesso requerida` })
    // else {
        
    //     jwt.verify(token, process.env.SECRET_KEY, 
    //         (err, decoded) => {
    //         if (err)
    //             res.status(401).json({ message: `Token inválido`})
    //         else{
    //             req.userId = decoded.id
    //             req.roles = decoded.roles
    //             next()
    //         }
        
    //     })
    // }    
}

apiSegRouter.isAdmin = (req, res, next) => {
    next()
    /* knex('public.usuario')
        .where({ id: req.usuarioId })
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
        }) */
    // if( !req.roles.includes('ADMIN'))
    //     res.status(403).json({ message: `Usuário não tem permissão para acessar!`})
    // else
    //     next()
}

module.exports = apiSegRouter;