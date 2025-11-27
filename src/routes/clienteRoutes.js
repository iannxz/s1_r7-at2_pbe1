const express = require('express');
const clienteRoutes = express.Router();
const {clienteController} = require ('../controllers/clienteController')

clienteRoutes.post('/cliente', clienteController.incluiCliente);