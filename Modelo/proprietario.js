import ProprietarioDAO from "../Persistencia/proprietarioDAO.js"; // Verifique o nome do arquivo e o caminho

export default class Proprietario {
    #codigo;
    #nome;

    constructor(codigo = 0, nome = '') {
        this.#codigo = codigo;
        this.#nome = nome;
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get nome() {
        return this.#nome;
    }

    set nome(novoNome) {
        this.#nome = novoNome;
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome
        };
    }

    async gravar() {
        const propDAO = new ProprietarioDAO();
        await propDAO.gravar(this); // Verifique a implementação do método gravar no DAO
    }
    async atualizar() {
        const propDAO = new ProprietarioDAO();
        await propDAO.atualizar(this); // Verifique a implementação do método gravar no DAO
    }

    async excluir() {
        const propDAO = new ProprietarioDAO();
        await propDAO.excluir(this); // Verifique a implementação do método excluir no DAO
    }

    async consultar(parametro) {
        const propDAO = new ProprietarioDAO();
        return await propDAO.consultar(parametro); // Verifique a implementação do método consultar no DAO
    }
}
