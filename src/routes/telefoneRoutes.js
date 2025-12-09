const express = require('express');
const telefoneRoutes = express.Router();
const telefoneController = require ('../controllers/telefoneController')

telefoneRoutes.post('/telefone', telefoneController.insereTelefone);
telefoneRoutes.delete('/telefone/:idTelefone', telefoneController.excluirTelefone);

module.exports =  telefoneRoutes; 