const db = require('../config/db'); 
const { selectById } = require('./pedidoModel');


/**
 * Model responsável pela interação direta com o banco de dados para Clientes.
 */
const clienteModel  = {

  /**
   * Insere um novo cliente chamando a procedure 'cadastra_cliente'.
   * Espera que a procedure receba 12 parâmetros.
   * * @param {Object} dadosCliente - Dados pessoais (nome, cpf, email, data_nascimento).
   * @param {Object} dadosEndereco - Dados de endereço (cep, rua, bairro, etc).
   * @param {string} telefone - Número de telefone.
   * @returns {Promise<Object>} Retorna o ID do cliente inserido.
   */
  insert: async (dadosCliente, dadosEndereco, telefone) => {

      const sql = `CALL cadastra_cliente(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`; // chamando a procedure
      
      const values = [
        dadosCliente.nome,
        dadosCliente.cpf,
        dadosCliente.email,
        dadosCliente.data_nascimento,

        dadosEndereco.cep,
        dadosEndereco.rua,
        dadosEndereco.bairro,
        dadosEndereco.cidade,
        dadosEndereco.uf,
        dadosEndereco.numero,
        dadosEndereco.complemento,
        telefone
      ];

      const [rows] = await db.query(sql, values);
      
      return rows[0][0]; // lendo em formato de tabela (coluna e linha)

  },

  /**
   * Verifica se um cliente existe pelo ID.
   * * @param {number|string} id - ID do cliente.
   * @returns {Promise<boolean>} True se existir, False se não.
   */
  verificarSeExiste: async (id) => {
    
      const sql = 'SELECT id_cliente FROM clientes WHERE id_cliente = ?'; 
      const [rows] = await db.query(sql, [id]);
      return [rows]
  },


/**
   * Remove um cliente chamando a procedure 'deleta_cliente'.
   * * @param {number|string} id - ID do cliente a ser removido.
   */
delete: async (id) => {
    
      const sql = 'CALL deleta_cliente(?)';
      await db.query(sql, [id]);
  },

  /**
   * Busca todos os clientes chamando a procedure 'seleciona_clientes'.
   * * @returns {Promise<Array>} Lista de clientes.
   */
  selectAll: async () => {
      const sql = 'CALL seleciona_clientes()';
      const [rows] = await db.query(sql);
      
      return rows[0]; 
  },

  selectById: async (id) => {
      const sql = 'SELECT * FROM clientes WHERE id_cliente = ?';
      const [rows] = await db.query(sql, id);
      return rows;
  },

  /**
   * Atualiza um cliente chamando a procedure 'atualiza_cliente'.
   * Espera que a procedure receba 13 parâmetros (ID + 12 campos).
   * * @param {number|string} id - ID do cliente.
   * @param {Object} dadosCliente - Dados pessoais.
   * @param {Object} dadosEndereco - Dados de endereço.
   * @param {string} telefone - Telefone.
   * @returns {Promise<boolean>} Retorna true após sucesso.
   */
  update: async (id, dadosCliente, dadosEndereco, telefone) => {
      const sql = `CALL atualiza_cliente(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
      const values = [
        id, 
        dadosCliente.nome,
        dadosCliente.cpf,
        dadosCliente.email,
        dadosCliente.data_nascimento,

        dadosEndereco.cep,
        dadosEndereco.rua,
        dadosEndereco.bairro,
        dadosEndereco.cidade,
        dadosEndereco.uf,
        dadosEndereco.numero,
        dadosEndereco.complemento,
        
        telefone
      ];

      await db.query(sql, values);
  },
};

module.exports =  clienteModel ;