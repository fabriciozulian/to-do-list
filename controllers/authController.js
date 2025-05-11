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

const loginUsuario = async (req, res) => {
    const { email, senha} = req.body;

    if(!email, !senha){
        res.status(400).json({ mensagem : 'E-mail e Senha são obrigatórios'})
    }

    try {
        const conn = await pool.getConnection();
        
        const [usuario] = await conn.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        conn.release();

        if(!usuario){
            res.status(401).json({ mensagem : 'Usuário ou Senha incorretos'});
        }

        //Verifica a senha

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if(!senhaValida){
            res.status(401).json({ mensagem : 'Usuário ou Senha incorretos'});
        }

        //Gera token

        const token = jwt.sign(
            {
                id: usuario.id,
                nome: usuario.nome
            }, 
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        return res.status(200).json({
            mensagem : 'Login realizado com sucesso!',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        })
        
    } catch(erro) {
        console.error('Erro no login', erro);
        return res.status(500).json({ mensagem : 'Erro ao realizar login'});
    }
}

module.exports = { 
                    registrarUsuario,
                    loginUsuario                    
                 };