const pool = require('../db');

// Criar nova tarefa
const criarTarefa = async (req, res) => {
  const { titulo, descricao } = req.body;
  const usuarioId = req.usuario.id;

  if (!usuarioId) {
    return res.status(401).json({ mensagem: 'Usuário não autenticado.' });
  }

  if (!titulo) {
    return res.status(400).json({ mensagem: 'Título é obrigatório.' });
  }
  try {
    const resultado = await pool.query(
      'INSERT INTO tarefas (titulo, descricao, id_usuario) VALUES (?, ?, ?)',
      [titulo, descricao, usuarioId]
    );
    res.status(201).json({ mensagem: 'Tarefa criada!', tarefaId: resultado.insertId.toString() });
    
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao criar tarefa.', erro });
  }
};

module.exports = {
  criarTarefa
};