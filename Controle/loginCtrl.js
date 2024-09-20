import Login from '../Modelo/login.js';

export default class LoginCtrl {
    login(requisicao, resposta) {
        resposta.type('application/json');

        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const { usuario, senha } = requisicao.body;

            const login = new Login(usuario, senha);

            login.autenticar()
                .then(token => {
                    resposta.status(200).json({
                        status: true,
                        token: token,
                        mensagem: 'Login realizado com sucesso!'
                    });
                })
                .catch(erro => {
                    resposta.status(401).json({
                        status: false,
                        mensagem: erro.message
                    });
                });
        } else {
            resposta.status(400).json({
                status: false,
                mensagem: 'Por favor, utilize o método POST com um JSON para login!'
            });
        }
    }
}
