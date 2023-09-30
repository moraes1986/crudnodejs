const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')

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
                                else{
                                    res.cookie('__session', token)
                                    res.status(200).json ({ status: 'success' })}
                            })
                    }
                    else
                        res.status(401).json({ message: `Usuário ou senha incorretos! `})
                })
            }
        })
    
})

apiSegRouter.checkToken = (req, res, next) => {
    let sessionCookie = "";
    if (req.headers.cookie) {
        if (req.headers.cookie.includes(`__session=`)) {
        req.headers.cookie.split('; ').forEach(cookie => {
            if (cookie.includes(`__session=`)) {
            sessionCookie = cookie.replace(`__session=`, '').trim()
            }
        })
        }
    }

    console.log(sessionCookie)

    if (!sessionCookie){
        const path = require('path').resolve(__dirname, './screens/statics/login.html');
        const file = fs.readFileSync(path,  { encoding: 'utf8'})
        res.status(403).send(file);
    }else {
        jwt.verify(sessionCookie, process.env.SECRET_KEY, 
            (err, decoded) => {
            if (err){
                const path = require('path').resolve(__dirname, './screens/statics/login.html');
                const file = fs.readFileSync(path,  { encoding: 'utf8'})
                res.status(403).send(file);
            }
            else{
                next()
            }
        
        })
    }    
}

apiSegRouter.isAdmin = (req, res, next) => {
    if( !req.roles.includes('ADMIN'))
         res.status(403).json({ message: `Usuário não tem permissão para acessar!`})
    else
       next()

}

module.exports = apiSegRouter;