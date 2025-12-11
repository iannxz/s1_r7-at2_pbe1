const express = require('express');
const router = express.Router();
const enderecoController = require('../controllers/enderecoController');

router.post('/endereco/:id_cliente', enderecoController.adicionarEndereco);
router.get('/endereco/:id_cliente', enderecoController.listarPorCliente);

module.exports = router;

