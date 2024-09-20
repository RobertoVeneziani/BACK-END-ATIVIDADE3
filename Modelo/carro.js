import CarroDAO from "../Persistencia/carroDAO.js";


export default class Carro {
    #codigo;
    #nome;

    constructor(codigo=0, nome=''){
        this.#codigo=codigo;
        this.#nome=nome;
    }


    get codigo(){
        return this.#codigo;
    }

    set codigo(novoCodigo){
        this.#codigo = novoCodigo;
    }

    get nome(){
        return this.#nome;
    }

    set nome(novaNome){
        this.#nome = novaNome;
    }

    //override do método toJSON
    toJSON()     
    {
        return {
            codigo:this.#codigo,
            nome:this.#nome
        }
    }

    //camada de modelo acessa a camada de persistencia
    async gravar(){
        const carDAO = new CarroDAO();
        await carDAO.gravar(this);
    }

    async excluir(){
        const carDAO = new CarroDAO();
        await carDAO.excluir(this);
    }

    async atualizar(){
        const carDAO = new CarroDAO();
        await carDAO.atualizar(this);

    }

    async consultar(parametro){
        const carDAO = new CarroDAO();
        return await carDAO.consultar(parametro);
    }

    async possuiPecas(){
        const carDAO = new CarroDAO();
        return await carDAO.possuiPecas(this);
    }
}