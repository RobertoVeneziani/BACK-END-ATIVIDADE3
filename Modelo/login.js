import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default class Login {
    #usuario;
    #senha;

    constructor(usuario = '', senha = '') {
        this.#usuario = usuario;
        this.#senha = senha;
    }

    async autenticar() {
        const usuarioValido = this.#usuario === 'Admin' && this.#senha === '1234';

        if (!usuarioValido) {
            throw new Error('Usuário ou senha inválidos');
        }

        const token = jwt.sign({ usuario: this.#usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return token;
    }
}
