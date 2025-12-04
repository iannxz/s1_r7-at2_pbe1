const { pool } = require('../config/db');

const pedidoModel = {
    selectAll: async () => {
        const procedure = 'CALL listar_pedidos();';
        const [rows] = await pool.query(procedure);
        return rows[0];
    },
    selectById: async (pId) => {
        const procedure = 'CALL listar_pedido_id(?)';
        const values = [pId];
        const [rows] = await pool.query(procedure, values);
        return rows[0];
    },
    insert: async (pTipoEntrega, pDistancia, pPesoCarga, pValorBaseKm, pValorBaseKg, pIdCliente) => {
        const procedure = 'CALL inserir_pedido(?,?,?,?,?,?);';
        const values = [pTipoEntrega, pDistancia, pPesoCarga, pValorBaseKm, pValorBaseKg, pIdCliente];
        const [rows] = await pool.query(procedure, values);
        return rows[0];
    },
    update: async (pId, pTipoEntrega, pDistancia, pPesoCarga, pValorBaseKm, pValorBaseKg, pIdCliente) => {
        const procedure = 'CALL alterar_pedido(?,?,?,?,?,?,?);';
        const values = [pId, pTipoEntrega, pDistancia, pPesoCarga, pValorBaseKm, pValorBaseKg, pIdCliente];
        const [rows] = await pool.query(procedure, values);
        return rows;
    }
    // delete: async (pId) => {
    //     const procedure = 'CALL deletar_pedido(?)';
    //     const values = [pId];
    //     const [rows] = await pool.query(procedure, values);
    //     return rows;
    // }




};

module.exports = { pedidoModel }