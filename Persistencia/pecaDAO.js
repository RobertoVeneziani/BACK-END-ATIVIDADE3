import Peca from '../Modelo/peca.js';
import Carro from '../Modelo/carro.js';
import conectar from './conexao.js';

export default class PecaDAO {

    constructor() {
        this.init();
    }

    async init() {
        try 
        {
            const conexao = await conectar(); //retorna uma conexão
            const sql = `
            CREATE TABLE IF NOT EXISTS peca(
                pec_codigo INT NOT NULL AUTO_INCREMENT,
                pec_descricao VARCHAR(100) NOT NULL,
                pec_preco DECIMAL(10,2) NOT NULL DEFAULT 0,
                pec_qtdEstoque DECIMAL(10,2) NOT NULL DEFAULT 0,
                car_codigo INT NOT NULL,
                CONSTRAINT pk_peca PRIMARY KEY(pec_codigo),
                CONSTRAINT fk_carro FOREIGN KEY(car_codigo) REFERENCES carro(car_codigo)
            )
        `;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }


    async gravar(peca) {
        if (peca instanceof Peca) {
            const sql = `INSERT INTO peca(pec_descricao, pec_preco, pec_qtdEstoque, car_codigo)
                VALUES(?,?,?,?)`;
            const parametros = [peca.descricao, peca.preco, peca.qtdEstoque, peca.carro.codigo];

            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            peca.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }
    async atualizar(peca) {
        if (peca instanceof Peca) {
            const sql = `UPDATE peca SET pec_descricao = ?, pec_preco = ?, pec_qtdEstoque = ?, car_codigo = ?
            WHERE pec_codigo = ?`;
            const parametros = [peca.descricao, peca.preco, peca.qtdEstoque, peca.carro.codigo, peca.codigo];

            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(peca) {
        if (peca instanceof Peca) {
            const sql = `DELETE FROM peca WHERE pec_codigo = ?`;
            const parametros = [peca.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(termo) {
        if (!termo){
            termo="";
        }
        //termo é um número
        const conexao = await conectar();
        let listaPecas = [];
        if (!isNaN(parseInt(termo))){
            //consulta pelo código da peca 
            const sql = `SELECT p.pec_codigo, p.pec_descricao,
              p.pec_preco, p.pec_qtdEstoque, c.car_codigo, c.car_nome
              FROM peca p
              INNER JOIN carro c ON p.car_codigo = p.pec_codigo
              WHERE p.pec_codigo = ?
              ORDER BY p.pec_descricao ;              
            `;
            const parametros=[termo];
            const [registros, campos] = await conexao.execute(sql,parametros);
            for (const registro of registros){
                const peca = new Peca(registro.pec_codigo,registro.pec_descricao,
                                            registro.pec_preco, registro.pec_qtdEstoque
                                            );
                listaPecas.push(peca);
            }
        }
        else
        {
            //consulta pelo termo
            const sql = `SELECT p.pec_codigo, p.pec_descricao,
                         p.pec_preco, p.pec_qtdEstoque, c.car_codigo, c.car_nome
                         FROM peca p
                         INNER JOIN carro c ON p.car_codigo = c.car_codigo
                         WHERE p.pec_descricao like ?
                         ORDER BY p.pec_descricao`;
            const parametros=['%'+termo+'%'];
            const [registros, campos] = await conexao.execute(sql,parametros);
            for (const registro of registros){
                const carro = new Carro(registro.car_codigo, registro.car_nome);
                const peca = new Peca(registro.pec_codigo,registro.pec_descricao,
                                            registro.pec_preco, registro.pec_qtdEstoque,
                                            carro
                                            );
                listaPecas.push(peca);
            }
        }

        return listaPecas;
    }
}