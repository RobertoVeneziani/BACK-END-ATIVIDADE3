import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function authMiddleware(requisicao, resposta, proximo) {
    // Ignora a rota de login
    if (requisicao.path.startsWith('/login')) {
        return proximo();
    }

    const authHeader = requisicao.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer token"

    if (token == null) return resposta.status(401).json({ status: false, mensagem: "Token não fornecido" });

    jwt.verify(token, process.env.JWT_SECRET, (erro, usuario) => {
        if (erro) return resposta.status(403).json({ status: false, mensagem: "Token inválido" });

        requisicao.usuario = usuario; // Adiciona o usuário ao objeto da requisição
        proximo(); // Continua para a próxima função de middleware ou rota
    });
}
