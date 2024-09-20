import Peca from "../Modelo/peca.js";
import Carro from "../Modelo/carro.js";

export default class PecaCtrl { 

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const descricao = dados.descricao;
            const preco = dados.preco;
            const qtdEstoque = dados.qtdEstoque;
            const car_codigo = dados.carro.codigo;

            if (descricao && preco > 0 && qtdEstoque >= 0 && car_codigo > 0) {
                const carro = new Carro(car_codigo);
                const peca = new Peca(0, descricao, preco,
                qtdEstoque, carro
                );
                //resolver a promise
                peca.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": peca.codigo,
                        "mensagem": "Peça incluído com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao registrar peça:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, os dados da peça são inválidos, segundo a documentação da API!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para cadastrar uma nova peça!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const descricao = dados.descricao;
            const preco = dados.preco;
            const qtdEstoque = dados.qtdEstoque;
            const car_codigo = dados.carro.codigo;

            if (codigo && descricao && preco > 0 && qtdEstoque >= 0 && car_codigo > 0) {
                const carro = new Carro(car_codigo);
                const peca = new Peca(codigo, descricao, preco,
                    qtdEstoque, carro);
                //resolver a promise
                peca.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Peca atualizado com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao atualizar peça:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe todos os dados da peca segundo a documentação da API!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar uma peca!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo) {
                const peca = new Peca(codigo);
                //resolver a promise
                peca.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Peca excluído com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao excluir peça:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código da peca!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir uma peca!"
            });
        }
    }


    consultar(requisicao, resposta) {
        resposta.type('application/json');
        //express, por meio do controle de rotas, será
        //preparado para esperar um termo de busca
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = "";
        }
        if (requisicao.method === "GET") {
            const peca = new Peca();
            peca.consultar(termo).then((listaPecas) => {
                resposta.json(
                    {
                        status: true,
                        listaPecas
                    });
            })
                .catch((erro) => {
                    resposta.json(
                        {
                            status: false,
                            mensagem: "Não foi possível obter as pecas: " + erro.message
                        }
                    );
                });
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar pecas!"
            });
        }
    }
}