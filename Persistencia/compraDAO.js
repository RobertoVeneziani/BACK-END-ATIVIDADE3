import conectar from "./conexao.js";
import Compra from "../Modelo/compra.js";

export default class CompraDAO {
    async consultar(codigoProprietario) {

        const sql = 'SELECT * FROM compra WHERE  prop_codigo = ?';
        const parametros = [codigoProprietario];
        console.log("parametros dentro da consultar",parametros);
        const conexao = await conectar();
        const [registros] = await conexao.execute(sql, parametros);
        await conexao.release();
    
        // Retorna true se encontrar registros, false caso contrário
        return registros.length > 0;
    }
    

    async atualizar(codigoProprietario,codigoCarro) {
        if (codigoCarro === undefined || codigoProprietario === undefined) {
            throw new Error('Código do carro ou código do proprietário não pode ser undefined');
        }
        const sql = 'UPDATE compra SET car_codigo  = ? WHERE prop_codigo = ?';
        const parametros = [codigoProprietario, codigoCarro];
        const conexao = await conectar();
        await conexao.execute(sql, parametros);
        await conexao.release();
    }

    async gravar(codigoCarro, codigoProprietario) {
        if (codigoCarro === undefined || codigoProprietario === undefined) {
            throw new Error('Código do carro ou código do proprietário não pode ser undefined');
        }
        const sql = 'INSERT INTO compra (car_codigo, prop_codigo) VALUES (?, ?)';
        const parametros = [codigoCarro, codigoProprietario];
        const conexao = await conectar();
        await conexao.execute(sql, parametros);
        await conexao.release();
    }

    async excluirPorProprietario(codigoProprietario) {
        if (codigoProprietario === undefined) {
            throw new Error('Código do proprietário não pode ser undefined');
        }
        const sql = 'DELETE FROM compra WHERE prop_codigo = ?';
        const parametros = [codigoProprietario];
        const conexao = await conectar();
        await conexao.execute(sql, parametros);
        await conexao.release();
    }
}

