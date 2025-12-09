const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController');

/**
 * Definição das Rotas de Endereço
 * Prefixo esperado no server.js: /enderecos
 */
router.post('/', enderecoController.adicionarEndereco);

router.get('/cliente/:id_cliente', enderecoController.listarPorCliente);

module.exports = router;