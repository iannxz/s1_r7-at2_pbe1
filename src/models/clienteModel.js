const db = require('../config/db'); 


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
    try {
      const sql = `CALL cadastra_cliente(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
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
      
      return rows[0][0]; 

    } catch (error) {
      console.error("Erro ao executar procedure:", error);
      throw error;
    }
  },

  /**
   * Verifica se um cliente existe pelo ID.
   * * @param {number|string} id - ID do cliente.
   * @returns {Promise<boolean>} True se existir, False se não.
   */
  verificarSeExiste: async (id) => {
    try {
      const sql = 'SELECT id_cliente FROM clientes WHERE id_cliente = ?'; 
      const [rows] = await db.query(sql, [id]);
      
      // true se encontrar, false se nao encontrar
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  },


/**
   * Remove um cliente chamando a procedure 'deleta_cliente'.
   * * @param {number|string} id - ID do cliente a ser removido.
   * @returns {Promise<boolean>} Retorna true após sucesso.
   */
delete: async (id) => {
    try {
      const sql = 'CALL deleta_cliente(?)';

      await db.query(sql, [id]);
      
      return true;
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      throw error;
    }
  },


  /**
   * Busca todos os clientes chamando a procedure 'seleciona_clientes'.
   * * @returns {Promise<Array>} Lista de clientes.
   */
  selectAll: async () => {
    try {
      const sql = 'CALL seleciona_clientes()';
      const [rows] = await db.query(sql);
      
      return rows[0]; 
    } catch (error) {
      console.error("Erro ao selecionar clientes:", error);
      throw error;
    }
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
    try {
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
      return true;

    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      throw error;
    }
  },
};

module.exports =  clienteModel ;