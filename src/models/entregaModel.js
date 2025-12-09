const  pool  = require('../config/db');

const entregaModel = {
    selectAll: async () => {
        const procedure = 'CALL listar_entrega();';
        const [rows] = await pool.query(procedure);
        return rows[0];
    },
    selectById: async (pId) => {
        const procedure = 'CALL listar_entrega_id(?)';
        const values = [pId];
        const [rows] = await pool.query(procedure, values);
        return rows[0];
    },
    update: async (pId, pStatusEntrega) => {
        const procedure = 'CALL alterar_status_entrega(?,?);';
        const values = [pId, pStatusEntrega];
        const [rows] = await pool.query(procedure, values);
        return rows;
    }
};

module.exports =  entregaModel 