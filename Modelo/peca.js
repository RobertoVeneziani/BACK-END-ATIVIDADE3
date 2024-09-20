import pecaDAO from "../Persistencia/pecaDAO.js";
import Carro from "./carro.js"

export default class Peca{
    #codigo;
    #descricao;
    #preco;
    #qtdEstoque;
    #carro;


    constructor(codigo=0,descricao="", preco=0, 
                qtdEstoque=0, carro = null
                ){
        this.#codigo=codigo;
        this.#descricao=descricao;
        this.#preco=preco;
        this.#qtdEstoque=qtdEstoque;
        this.#carro=carro;
    }

    get codigo(){
        return this.#codigo;
    }
    set codigo(novoCodigo){
        this.#codigo = novoCodigo;
    }

    get descricao(){
        return this.#descricao;
    }

    set descricao(novaDesc){
        this.#descricao=novaDesc;
    }

    get preco(){
        return this.#preco;
    }

    set preco(novoPreco){
        this.#preco = novoPreco
    }

    get qtdEstoque(){
        return this.#qtdEstoque;
    }

    set qtdEstoque(novaQtd){
        this.#qtdEstoque = novaQtd;
    }

    get carro(){
        return this.#carro;
    }

    set carro(novaCar){
        if (novaCar instanceof Carro){
        this.#carro = novaCar;
        }
    }


    toJSON(){
        return {
            codigo:this.#codigo,
            descricao:this.#descricao,
            precoCusto:this.#preco,
            qtdEstoque:this.#qtdEstoque,
            carro:this.#carro
        }
    }

     //camada de modelo acessa a camada de persistencia
     async gravar(){
        const pecDAO = new pecaDAO();
        await pecDAO.gravar(this);
     }
 
     async excluir(){
        const pecDAO = new pecaDAO();
        await pecDAO.excluir(this);
     }
 

     async alterar(){
        const pecDAO = new pecaDAO();
        await pecDAO.atualizar(this);
     }
 
     async consultar(termo){
        const pecDAO = new pecaDAO();
        return await pecDAO.consultar(termo);
     }

}