import Carro from "../Modelo/carro.js";
import conectar from "./conexao.js";

export default class CarroDAO{

    constructor() {
        this.init();
    }
    
    async init() {
        try 
        {
            const conexao = await conectar(); 
            const sql = `
                CREATE TABLE IF NOT EXISTS carro(
                    car_codigo INT NOT NULL AUTO_INCREMENT,
                    car_nome VARCHAR(100) NOT NULL,
                    CONSTRAINT pk_carro PRIMARY KEY(car_codigo)
                );`;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }
    async gravar(carro){
        if (carro instanceof Carro){
            const sql = "INSERT INTO carro(car_nome) VALUES(?)"; 
            const parametros = [carro.nome];
            const conexao = await conectar(); 
            const retorno = await conexao.execute(sql,parametros); 
            carro.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(carro){
        if (carro instanceof Carro){
            const sql = "UPDATE carro SET car_nome = ? WHERE car_codigo = ?"; 
            const parametros = [carro.nome, carro.codigo];
            const conexao = await conectar(); 
            await conexao.execute(sql,parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(carro){
        if (carro instanceof Carro){
            const sql = "DELETE FROM carro WHERE car_codigo = ?"; 
            const parametros = [carro.codigo];
            const conexao = await conectar(); 
            await conexao.execute(sql,parametros); 
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(parametroConsulta){
        let sql='';
        let parametros=[];
        //é um número inteiro?
        if (!isNaN(parseInt(parametroConsulta))){
            //consultar pelo código do carro
            sql='SELECT * FROM carro WHERE car_codigo = ? order by car_nome';
            parametros = [parametroConsulta];
        }
        else{
            //consultar pela descricao
            if (!parametroConsulta){
                parametroConsulta = '';
            }
            sql = "SELECT * FROM carro WHERE car_nome like ?";
            parametros = ['%'+parametroConsulta+'%'];
        }
        const conexao = await conectar();
        const [registros, campos] = await conexao.execute(sql,parametros);
        let listaCarros = [];
        for (const registro of registros){
            const carro = new Carro(registro.car_codigo,registro.car_nome);
            listaCarros.push(carro);
        }
        return listaCarros;
    }

    async possuiPecas(carro){
        if (carro instanceof Carro){
            const sql = `SELECT count(*) FROM peca p
                         INNER JOIN carro c ON p.car_codigo = c.car_codigo
                         WHERE c.car_codigo = ?`;
            const parametros = [carro.codigo];
            const [registros] = await global.poolConexoes.execute(sql, parametros);
            return registros[0].qtd > 0;
        }
    }

}