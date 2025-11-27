const db = require('../config/db'); 

const clienteModel = {

  /**
   * Insere um novo cliente, seu endereço e telefone no banco utilizando transação.
   * @param {Object} dadosCliente 
   * @param {Object} dadosEndereco 
   * @param {string} telefone
   * @returns {Object} 
   */
  insert: async (dadosCliente, dadosEndereco, telefone) => {
    let connection;
    try {
      connection = await db.getConnection();
      
      await connection.beginTransaction();

      const sqlCliente = `
        INSERT INTO clientes (nome, cpf, email) 
        VALUES (?, ?, ?)
      `;
      const valuesCliente = [dadosCliente.nome, dadosCliente.cpf, dadosCliente.email];
      const [resultCliente] = await connection.query(sqlCliente, valuesCliente);
      
      const novoIdCliente = resultCliente.insertId; 

      const sqlEndereco = `
        INSERT INTO enderecos (cliente_id, cep, logradouro, bairro, cidade, uf, numero, complemento) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const valuesEndereco = [
        novoIdCliente, 
        dadosEndereco.cep, 
        dadosEndereco.logradouro, 
        dadosEndereco.bairro, 
        dadosEndereco.cidade, 
        dadosEndereco.uf,
        dadosEndereco.numero,
        dadosEndereco.complemento
      ];
      await connection.query(sqlEndereco, valuesEndereco);

      const sqlTelefone = `INSERT INTO telefones (cliente_id, numero) VALUES (?, ?)`;
      await connection.query(sqlTelefone, [novoIdCliente, telefone]);

      await connection.commit();
      
      return { id: novoIdCliente, mensagem: "Cliente cadastrado com sucesso!" };

    } catch (error) {
      if (connection) await connection.rollback();
      console.error("Erro na transação:", error);
      throw error;
    } finally {

      if (connection) connection.release();
    }
  },
}

module.exports = clienteModel;