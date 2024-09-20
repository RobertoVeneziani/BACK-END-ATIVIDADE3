import Proprietario from "../Modelo/proprietario.js";
import Compra from "../Modelo/compra.js"
import CompraDAO from "../Persistencia/compraDAO.js";
import ProprietarioDAO from "../Persistencia/proprietarioDAO.js";

export default class ProprietarioCtrl {

    constructor() {
        this.gravar = this.gravar.bind(this);
        this.atualizar = this.atualizar.bind(this);
        this.excluir = this.excluir.bind(this);
        this.consultar = this.consultar.bind(this);
    }

    async gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const nome = dados.nome;
            const codigocarro = dados.carroCodigo
            if (nome) {
                const proprietario = new Proprietario(0, nome);
                
                try {
                    await proprietario.gravar();
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": proprietario.codigo,
                        "mensagem": "Proprietário incluído com sucesso!"
                    });
                    const compra = new Compra(0,codigocarro,proprietario.codigo)
                    await compra.gravar();
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao registrar o proprietário: " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o nome do proprietário!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para cadastrar um proprietário!"
            });
        }
    }

    async atualizar(requisicao, resposta) {
        resposta.type('application/json');
    
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = requisicao.params.codigo; // Código do proprietário
            const nome = dados.nome;
            const codigocarro = dados.carroCodigo;
    
            console.log("Dados recebidos:", { codigo, nome, codigocarro });
    
            if (codigo && nome && codigocarro) {
                const proprietario = new Proprietario(codigo, nome);
                const compra = new Compra(0, codigocarro, codigo);
    
                try {
                    // Atualizar o proprietário
                    await proprietario.atualizar(); 
    
                    // Verificar se a compra já existe
                    const compraExistente = await compra.consultar();
                    console.log("Compra existente dentro da atualizar>:",compraExistente);
    
                    if (compraExistente) {
                        // Atualizar compra existente
                        await compra.atualizar();
                    } else {
                        // Gravar nova compra
                        await compra.gravar();
                    }
    
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Proprietário atualizado com sucesso!"
                    });
                } catch (erro) {
                    console.error('Erro ao atualizar proprietário:', erro);
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao atualizar o proprietário: " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código, o nome do proprietário e o código do carro!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar um proprietário!"
            });
        }
    }
    
    
    
    
    

    
    

    async excluir(requisicao, resposta) {
        resposta.type('application/json');
    
        if (requisicao.method === 'DELETE') {
            const codigo = requisicao.params.codigo; // Código do proprietário passado pela URL
            const { carroCodigo } = requisicao.body; // Código do carro passado no corpo da requisição
    
            console.log("Dados recebidos para exclusão:", { codigo, carroCodigo }); // Verifique os dados recebidos
    
            if (codigo && carroCodigo) {
                const proprietario = new Proprietario(codigo);
                const compra = new Compra(0, carroCodigo, codigo);
    
                try {
                    await compra.excluirPorProprietario(codigo);
                    
                    // Excluir o proprietário
                    await proprietario.excluir();
                    return resposta.status(200).json({
                        "status": true,
                        "mensagem": "Proprietário e registros associados excluídos com sucesso!"
                    });
    
                } catch (erro) {
                    console.error('Erro ao excluir proprietário:', erro);
                    return resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao excluir o proprietário: " + erro.message
                    });
                }
            } else {
                return resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código do proprietário e o código do carro no corpo da requisição!"
                });
            }
        } else {
            return resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método DELETE para excluir um proprietário!"
            });
        }
    }
    
    
    
    
    async consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo || "";
        if (requisicao.method === 'GET') {
            try {
                const proprietario = new Proprietario();
                const listaProprietarios = await proprietario.consultar(termo);
                resposta.json({
                    status: true,
                    listaProprietarios
                });
            } catch (erro) {
                resposta.json({
                    status: false,
                    mensagem: "Não foi possível obter os proprietários: " + erro.message
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar proprietários!"
            });
        }
    }
    async consultarProprietariosComCarros(requisicao, resposta) {
        resposta.type('application/json');
    
        if (requisicao.method === 'GET') {
            try {
                const sql = `
                    SELECT p.prop_codigo AS proprietario_codigo, p.prop_nome AS proprietario_nome, 
                           c.car_codigo AS carro_codigo, c.car_nome AS carro_nome
                    FROM proprietario p
                    LEFT JOIN compra cp ON p.prop_codigo = cp.prop_codigo
                    LEFT JOIN carro c ON cp.car_codigo = c.car_codigo
                `;
                const [registros] = await global.poolConexoes.execute(sql);
    
                // Construir um objeto que agrupa os carros por proprietário
                const listaProprietariosComCarros = registros.reduce((resultado, registro) => {
                    const { proprietario_codigo, proprietario_nome, carro_codigo, carro_nome } = registro;
    
                    // Verifica se o proprietário já foi adicionado no resultado
                    let proprietario = resultado.find(p => p.codigo === proprietario_codigo);
                    if (!proprietario) {
                        proprietario = {
                            codigo: proprietario_codigo,
                            nome: proprietario_nome,
                            carros: []
                        };
                        resultado.push(proprietario);
                    }
    
                    // Adiciona o carro, ou "Não possui" se o carro for nulo
                    if (carro_nome) {
                        proprietario.carros.push({ 
                            codigo: carro_codigo,   // Inclui o código do carro
                            nome: carro_nome 
                        });
                    } else {
                        proprietario.carros.push({ 
                            codigo: null, 
                            nome: 'Não possui' 
                        });
                    }
    
                    return resultado;
                }, []);
    
                resposta.json({
                    status: true,
                    listaProprietarios: listaProprietariosComCarros
                });
            } catch (erro) {
                resposta.json({
                    status: false,
                    mensagem: "Não foi possível obter os proprietários: " + erro.message
                });
            }
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: "Por favor, utilize o método GET para consultar proprietários!"
            });
        }
    }
    
    
    
    
}
