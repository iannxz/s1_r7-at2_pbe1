const { pool } = require('../config/db');

const clienteModel  = {
  insert: async (dadosCliente, dadosEndereco, telefone) => {
    try {
      const sql = `CALL cadastra_cliente(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
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

      const [rows] = await pool.query(sql, values);
      
      return rows[0][0]; 

    } catch (error) {
      console.error("Erro ao executar procedure:", error);
      throw error;
    }
  },
}

module.exports = clienteModel ;