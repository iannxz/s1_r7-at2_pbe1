const express = require('express');
const clienteRoutes = express.Router();

const clienteController = require('../controllers/clienteController');

clienteRoutes.post('/cliente', clienteController.incluiCliente);
clienteRoutes.delete('/cliente/:id', clienteController.deletaCliente);
clienteRoutes.put('/cliente/:id', clienteController.atualizaCliente);
clienteRoutes.get('/cliente/:id', clienteController.buscaCliente);

module.exports = clienteRoutes;
