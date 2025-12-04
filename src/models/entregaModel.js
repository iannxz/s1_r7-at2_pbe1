const { pool } = require('../config/db');

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
    },// criar de forma automatica, apos a criação do pedido, e atualizar tbm, os valores, fazendo o calculo 
    // insert: async (pId, pValorDistancia, pValorPeso, pAcrescimo, pDesconto, pTaxaExtra, pvalorFinal, pStatusEntrega) => {
    //     const procedure = 'CALL inserir_entrega(?,?,?,?,?,?);';
    //     const values = [pId, pValorDistancia, pValorPeso, pAcrescimo, pDesconto, pTaxaExtra, pvalorFinal, pStatusEntrega];
    //     const [rows] = await pool.query(procedure, values);
    //     return rows[0];
    //},// só é possivel editar lgumas coisas
    update: async (pId, pStatusEntrega) => {
        const procedure = 'CALL alterar_status_entrega(?,?);';
        const values = [pId, pStatusEntrega];
        const [rows] = await pool.query(procedure, values);
        return rows;
    }
    // // devo deletar entregas e pedidos??? Talvez não tenha motivo
    // delete: async (pId) => {
    //     const procedure = 'CALL deletar_entrega(?)';
    //     const values = [pId];
    //     const [rows] = await pool.query(procedure, values);
    //     return rows;
    // }


    // PAREI AQUI, FIZ UM INSERT NO PEDIDO, FUNCIONOU PARCIALMENTE, NÃO ESÁ CALCULANDO CERTO NA ENTREGA, ACRO QUE NÃO É DECIAMAL(10,2) EM DISTANCIAA


};

module.exports = { entregaModel }