import CompraDAO from '../Persistencia/compraDAO.js';

export default class Compra {
    #codigo;
    #carroCodigo;
    #proprietarioCodigo;

    constructor(codigo = 0, carroCodigo = 0, proprietarioCodigo = 0) {
        this.#codigo = codigo;
        this.#carroCodigo = carroCodigo;
        this.#proprietarioCodigo = proprietarioCodigo;
    }

    get codigo() {
        return this.#codigo;
    }

    set codigo(novoCodigo) {
        this.#codigo = novoCodigo;
    }

    get carroCodigo() {
        return this.#carroCodigo;
    }

    set carroCodigo(novoCarroCodigo) {
        this.#carroCodigo = novoCarroCodigo;
    }

    get proprietarioCodigo() {
        return this.#proprietarioCodigo;
    }

    set proprietarioCodigo(novoProprietarioCodigo) {
        this.#proprietarioCodigo = novoProprietarioCodigo;
    }

    async gravar() {
        const compraDAO = new CompraDAO();
        await compraDAO.gravar(this.#carroCodigo, this.#proprietarioCodigo);
    }

    async atualizar() {
        const compraDAO = new CompraDAO();
        await compraDAO.atualizar(this.#carroCodigo, this.#proprietarioCodigo);
    }

    async verificar() {
        const compraDAO = new CompraDAO();
        return await compraDAO.consultar(this.#carroCodigo, this.#proprietarioCodigo);
    }

    async excluir() {
        const compraDAO = new CompraDAO();
        await compraDAO.excluir(this.#carroCodigo, this.#proprietarioCodigo);
    }

    async consultar() {
        const compraDAO = new CompraDAO();
        console.log("Consultando compra com parâmetros:", this.carroCodigo, this.proprietarioCodigo);
        return await compraDAO.consultar(this.proprietarioCodigo);
    }
    async excluirPorProprietario(codigoProprietario) {
        const compraDAO = new CompraDAO();
        await compraDAO.excluirPorProprietario(codigoProprietario);
    }

}
