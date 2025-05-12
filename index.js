const express = require('express');
const cors = require('cors');
const pool = require('./db');
const tarefasController = require('./controllers/tarefasController');
require('dotenv').config();
const autenticarToken = require('./middlewares/authMiddleware');
const { registrarUsuario, loginUsuario } = require('./controllers/authController');


const app = express();
app.use(cors());
app.use(express.json());

app.get('/tarefas', autenticarToken, tarefasController.listarTarefas);
app.post('/tarefas', autenticarToken, tarefasController.criarTarefa);
app.put('/atualizar', autenticarToken, tarefasController.atualizarTarefas)
app.post('/register', registrarUsuario);
app.get('/login', loginUsuario);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));