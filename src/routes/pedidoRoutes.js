const express = require('express');
const pedidoRoutes = express.Router();
const {pedidoController} = require ('../controllers/pedidoController')

pedidoRoutes.get('/pedido', pedidoController.selecinaPedido);
pedidoRoutes.post('/pedido', pedidoController.inserePedido);
pedidoRoutes.put('/pedido/:idPedido', pedidoController.atualizaPedido);
// pedidoRoutes.delete('/pedido/:idPedido', pedidoController.excluiPedido);

module.exports = { pedidoRoutes }; 