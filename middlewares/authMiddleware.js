const jwt = require('jsonwebtoken');

//Middleware para verificar se o token é válido

const autenticarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
}

if(!token) {
    return res.status(401).json({ mensagem : "Token não fornecido"});
}

jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
        return res.status(403).json({ mensagem: "Token não fornecido" });
    }

    req.usuario = usuario;
    next();
})
