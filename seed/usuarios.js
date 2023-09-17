const bcrypt = require('bcryptjs')
/**
 * @param {import ("knex").Knex  } knex
 * @returns { Promise<void> }
 */

exports.seed = async function(knex){
    // Delete ALL existing entries

    await knex('usuarios').del()
    await knex('usuarios').insert([
        {id: 1, "nome":"Usuário padrão","login":"user","email":"usuario123@abb.com",
            "senha": bcrypt.hashSync("1234",8),"roles":"USER"}
    ]);
};