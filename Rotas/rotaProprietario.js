import { Router } from "express";
import ProprietarioCtrl from "../Controle/proprietarioCtrl.js";

const propCtrl = new ProprietarioCtrl();
const rotaProprietario = new Router();

// Definindo as rotas
rotaProprietario
   //.get('/', propCtrl.consultar)      // Consultar todos os proprietários
    .get('/', propCtrl.consultarProprietariosComCarros)        
    .get('/:termo', propCtrl.consultar)      // Consultar por termo
    .post('/', propCtrl.gravar)              // Gravar um novo proprietário
    .patch('/:codigo', propCtrl.atualizar)          // Atualizar um proprietário
    .put('/:codigo', propCtrl.atualizar)            // Atualizar um proprietário
    .delete('/:codigo', propCtrl.excluir);          // Excluir um proprietário

export default rotaProprietario;
