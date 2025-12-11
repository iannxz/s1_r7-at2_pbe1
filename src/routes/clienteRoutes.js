const express = require('express');
const clienteRoutes = express.Router();

const clienteController = require('../controllers/clienteController');

clienteRoutes.post('/cliente', clienteController.incluiCliente);
clienteRoutes.delete('/cliente/:id', clienteController.deletaCliente);
clienteRoutes.get('/cliente', clienteController.selecionaTodos);
clienteRoutes.get('/cliente/:id', clienteController.selecionaCliente);
clienteRoutes.put('/cliente/:id', clienteController.atualizaCliente);


module.exports = clienteRoutes;