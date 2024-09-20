import { Router } from "express";
import PecaCtrl from "../Controle/pecaCtrl.js";

const pecCtrl = new PecaCtrl();
const rotaPeca = new Router();

rotaPeca
.get('/', pecCtrl.consultar)
.get('/:termo', pecCtrl.consultar)
.post('/', pecCtrl.gravar)
.patch('/', pecCtrl.atualizar)
.put('/', pecCtrl.atualizar)
.delete('/', pecCtrl.excluir);

export default rotaPeca;