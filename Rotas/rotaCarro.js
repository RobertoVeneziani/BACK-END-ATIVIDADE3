import { Router } from "express";
import CarroCtrl from "../Controle/carroCtrl.js";


const carCtrl = new CarroCtrl();
const rotaCarro = new Router();

rotaCarro
.get('/',carCtrl.consultar)
.get('/:termo', carCtrl.consultar)
.post('/',carCtrl.gravar)
.patch('/',carCtrl.atualizar)
.put('/',carCtrl.atualizar)
.delete('/',carCtrl.excluir);

export default rotaCarro;