const db = require('../config/db');

/**
 * Model para operações na tabela de endereços.
 */
const enderecoModel = {
  
  /**
   * Insere um novo endereço ligado a um cliente.
   * @param {Object} dados - Objeto contendo id_cliente, cep, rua, etc.
   */
  insert: async (dados) => {
      const sql = `INSERT INTO enderecos (id_cliente, cep, rua, bairro, cidade, uf, numero, complemento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      
      const values = [
        dados.id_cliente,
        dados.cep,
        dados.rua,
        dados.bairro,
        dados.cidade,
        dados.uf,
        dados.numero,
        dados.complemento
      ];

      const [result] = await db.query(sql, values);
      return result;
  },

  /**
   * Busca endereços pelo ID do cliente.
   * @param {number} idCliente 
   */
  buscarPorCliente: async (idCliente) => {
          const sql = 'SELECT * FROM enderecos WHERE id_cliente = ?';
          const [rows] = await db.query(sql, [idCliente]);
          return rows;
  }
};

module.exports = enderecoModel;