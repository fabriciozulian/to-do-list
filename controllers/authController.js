const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const registrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if(!nome || !email || !senha){
        return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.'});
    }

    try {
        const conn = await pool.getConnection();

        //Verifica se o e-mail já existe
        const [usuarioExiste] = await conn.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if(usuarioExiste){
            conn.release();
            return res.status(400).json({ mensagem: 'E-mail ja cadastrado'});
        }

        // Criptografar a senha

        const hashSenha = await bcrypt.hash(senha, 10);

        // Cria o usuário

        const result = await conn.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hashSenha]);
        
        // Fecha conexão
        conn.release();

        return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso'});
    } catch (erro) {
        console.error('Erro no cadastro:', erro);
        return res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.'})
    }
};

module.exports = { 
                    registrarUsuario             
                 };