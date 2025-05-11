const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const { registrarUsuario, loginUsuario } = require('./controllers/authController');


const app = express();
app.use(cors());
app.use(express.json());

app.post('/register', registrarUsuario);
app.get('/login', loginUsuario);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));