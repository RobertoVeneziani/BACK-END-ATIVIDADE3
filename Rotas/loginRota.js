import { Router } from 'express';
import LoginCtrl from '../Controle/loginCtrl.js';

const loginCtrl = new LoginCtrl();
const rotaLogin = new Router();

rotaLogin.post('/', loginCtrl.login);

export default rotaLogin;
