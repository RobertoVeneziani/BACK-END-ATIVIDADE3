import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './mid/authMiddleware.js'; 
import rotaCarro from './Rotas/rotaCarro.js';
import rotaPeca from './Rotas/rotaPeca.js';
import rotaProprietario from './Rotas/rotaProprietario.js';
import rotaCompra from './Rotas/rotaCompra.js';
import login from './Rotas/loginRota.js'; 

dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Aplica o middleware globalmente
// app.use(authMiddleware);

app.use('/carro', rotaCarro);
app.use('/peca', rotaPeca);
app.use('/proprietario', rotaProprietario);
app.use('/compra', rotaCompra);
app.use('/login', login); // Rota de login, não protegida

const host = '0.0.0.0';
const porta = 5000;

const server = app.listen(porta, host, () => {
    console.log(`Servidor escutando na porta ${host}:${porta}.`);
});

server.maxConnections = Infinity;
