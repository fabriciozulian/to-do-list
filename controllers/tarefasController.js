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

// Listar tarefas do usuário
const listarTarefas = async (req, res) => {
  const usuarioId = req.usuario.id;

  try {
    const tarefas = await pool.query(
      'SELECT * FROM tarefas WHERE id_usuario = ? ORDER BY criado_em DESC',
      [usuarioId]
    );
    

    res.json(tarefas);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ mensagem: 'Erro ao buscar tarefas.' });
  }
};

// Atualiza tarefa
const atualizarTarefas = async (req, res) => {
    const usuarioId = req.usuario.id;
    const {titulo, descricao, id} = req.body;

    if(!id || !titulo || !descricao){
        res.status(400).json({ mensagem: 'Titulo, descricao, ou id incorreto'});
    }
    try{
        const resultado = await pool.query(
            'UPDATE tarefas SET titulo = ?, descricao = ? WHERE id = ? AND id_usuario = ?',
            [titulo, descricao, id, usuarioId]
          );

        res.status(200).json({mensagem: "tarefa atualizada", resultado});
    } catch {
        res.status(500).json({ mensagem: 'Erro ao tentar atualizar a tarefa.'});
    }
};

module.exports = {
  criarTarefa,
  listarTarefas,
  atualizarTarefas
};