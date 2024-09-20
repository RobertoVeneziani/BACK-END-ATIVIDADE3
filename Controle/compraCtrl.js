import Compra from "../Modelo/compra.js";
import CompraDAO from "../Persistencia/compraDAO.js";

export default class CompraCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const carroCodigo = dados.carroCodigo;
            const proprietarioCodigo = dados.proprietarioCodigo;
            if (carroCodigo && proprietarioCodigo) {
                const compra = new Compra(0, carroCodigo, proprietarioCodigo);
                compra.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Compra registrada com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao registrar a compra: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código do carro e do proprietário!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para registrar uma compra!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const carroCodigo = dados.carroCodigo;
            const proprietarioCodigo = dados.proprietarioCodigo;
            if (carroCodigo && proprietarioCodigo) {
                const compra = new Compra(0, carroCodigo, proprietarioCodigo);
                compra.excluir().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Compra excluída com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir a compra: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código do carro e do proprietário!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir uma compra!"
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type('application/json');
    
        if (requisicao.method === 'GET') {
            const termo = requisicao.query.termo; // Supondo que o termo de consulta seja um parâmetro de consulta
    
            const compraDAO = new CompraDAO();
    
            try {
                // Se o termo não for fornecido, consulte todos os registros
                const listaCompras = termo
                    ? await compraDAO.consultar(termo)
                    : await compraDAO.consultar(); // Chama o método de consultar sem parâmetros
    
                resposta.status(200).json({
                    status: true,
                    listaCompras
                });
            } catch (erro) {
                resposta.status(500).json({
                    status: false,
                    mensagem: "Não foi possível obter as compras: " + erro.message
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar compras!"
            });
        }
    }
}
