const { pool } = require('../config/db');

const telefoneModel = {
    selectById: async (pIdTelefone) => {
        const procedure = 'CALL listar_telefone_id(?)';
        const values = [pIdTelefone];
        const [rows] = await pool.query(procedure, values);
        return rows[0];
    },
    insert: async (pIdCliente, pTelefone) => {
        const procedure = 'CALL inserir_telefone(?,?);';
        const values = [pIdCliente, pTelefone];
        const [rows] = await pool.query(procedure, values);
        return rows[0];
    },
    delete: async (pIdTelefone) => {
        const procedure = 'CALL deletar_telefone(?);';
        const values = [pIdTelefone];
        const [rows] = await pool.query(procedure, values);
        return rows[0];
    }
};

module.exports = { telefoneModel }