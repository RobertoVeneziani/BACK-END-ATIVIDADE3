import Carro from "../Modelo/carro.js";

export default class CarroCtrl {

    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const nome = dados.nome;
            if (nome) {
                const carro = new Carro(0, nome);
                //resolver a promise
                carro.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": carro.codigo,
                        "mensagem": "Carro incluído com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao registrar o carro:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o nome do carro!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para cadastrar um carro!"
            });
        }
    }

    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const nome = dados.nome;
            if (codigo && nome) {
                const carro = new Carro(codigo, nome);
                //resolver a promise
                carro.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Carro atualizado com sucesso!"
                    });
                })
                    .catch((erro) => {
                        resposta.status(500).json({
                            "status": false,
                            "mensagem": "Erro ao atualizar o carro:" + erro.message
                        });
                    });
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código e o nome do carro!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar um carro!"
            });
        }
    }

    excluir(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'DELETE' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            if (codigo) {
                const carro = new Carro(codigo);
                carro.possuiPecas().then(possui =>{
                    if(possui == false){
                        carro.excluir().then(() => {
                            resposta.status(200).json({
                                "status": true,
                                "mensagem": "Carro excluído com sucesso!"
                            });
                        })
                        .catch((erro) => {
                                resposta.status(500).json({
                                    "status": false,
                                    "mensagem": "Erro ao excluir o carro:" + erro.message
                                });
                            }); 
                    }
                    else{
                        resposta.status(400).json({
                            "status": false,
                            "mensagem": "Este carro contém pecas e nao pode ser excluído!"        
                        });
                    }
                }); 
                
            }
            else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código do carro!"
                });
            }
        }
        else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir um carro!"
            });
        }
    }


    consultar(requisicao, resposta) {
        resposta.type('application/json');
        //express, por meio do controle de rotas, será
        //preparado para esperar um termo de busca
        let termo = requisicao.params.termo;
        if (!termo){
            termo = "";
        }
        if (requisicao.method === "GET"){
            const carro = new Carro();
            carro.consultar(termo).then((listaCarros)=>{
                resposta.json(
                    {
                        status:true,
                        listaCarros
                    });
            })
            .catch((erro)=>{
                resposta.json(
                    {
                        status:false,
                        mensagem:"Não foi possível obter os carros: " + erro.message
                    }
                );
            });
        }
        else 
        {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar carros!"
            });
        }
    }
}