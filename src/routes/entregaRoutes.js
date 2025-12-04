const express = require('express');
const entregaRoutes = express.Router();
const {entregaController} = require ('../controllers/entregaController')

entregaRoutes.get('/entrega', entregaController.selecinaEntrega);
entregaRoutes.put('/entrega/:idPedidoEntrega', entregaController.atualizaEntrega);

module.exports = { entregaRoutes }; 