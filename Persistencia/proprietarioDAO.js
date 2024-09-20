import Proprietario from "../Modelo/proprietario.js";
import conectar from "./conexao.js";

export default class ProprietarioDAO {

    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar();
            const sql = `
                CREATE TABLE IF NOT EXISTS proprietario (
                    prop_codigo INT NOT NULL AUTO_INCREMENT,
                    prop_nome VARCHAR(100) NOT NULL,
                    CONSTRAINT pk_proprietario PRIMARY KEY (prop_codigo)
                );`;
            await conexao.execute(sql);
            await conexao.release();
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(proprietario) {
        if (proprietario instanceof Proprietario) {
            const sql = "INSERT INTO proprietario(prop_nome) VALUES(?)";
            const parametros = [proprietario.nome];
            const conexao = await conectar();
            const retorno = await conexao.execute(sql, parametros);
            proprietario.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(proprietario) {
        if (proprietario instanceof Proprietario) {
            const sql = "UPDATE proprietario SET prop_nome = ? WHERE prop_codigo = ?";
            const parametros = [proprietario.nome, proprietario.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(proprietario) {
        if (proprietario instanceof Proprietario) {
            const sql = "DELETE FROM proprietario WHERE prop_codigo = ?";
            const parametros = [proprietario.codigo];
            const conexao = await conectar();
            await conexao.execute(sql, parametros);
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        // é um número inteiro?
        if (!isNaN(parseInt(parametroConsulta))) {
            // Consultar pelo código do proprietário
            sql = 'SELECT * FROM proprietario WHERE prop_codigo = ? ORDER BY prop_nome';
            parametros = [parametroConsulta];
        } else {
            // Consultar pelo nome
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = "SELECT * FROM proprietario WHERE prop_nome LIKE ?";
            parametros = ['%' + parametroConsulta + '%'];
        }
        const conexao = await conectar();
        const [registros] = await conexao.execute(sql, parametros);
        let listaProprietarios = [];
        for (const registro of registros) {
            const proprietario = new Proprietario(registro.prop_codigo, registro.prop_nome);
            listaProprietarios.push(proprietario);
        }
        return listaProprietarios;
    }

    async possuiCarros(proprietario) {
        if (proprietario instanceof Proprietario) {
            const sql = `
                SELECT COUNT(c.codigo) as qtd
                FROM proprietario p
                LEFT JOIN compra cp ON p.prop_codigo = cp.prop_codigo
                LEFT JOIN carro c ON cp.car_codigo = c.codigo
                WHERE p.prop_codigo = ?
            `;
            const parametros = [proprietario.codigo];
            const [registros] = await global.poolConexoes.execute(sql, parametros);
            return registros[0].qtd > 0;
        }
    }

}
