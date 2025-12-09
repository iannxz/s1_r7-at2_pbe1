const express = require('express');
const router = express.Router();
const { clienteRoutes } = require('./clienteRoutes');
const { pedidoRoutes } = require('./pedidoRoutes');
const { entregaRoutes } = require('./entregaRoutes');
const { telefoneRoutes } = require('./telefoneRoutes');

router.use('/', clienteRoutes);
router.use('/', pedidoRoutes);
router.use('/', entregaRoutes);
router.use('/', telefoneRoutes)


module.exports = { router };
