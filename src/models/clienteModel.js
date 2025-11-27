const db = require('../config/db'); 

const { clienteModel } = {
  insert: async (dadosCliente, dadosEndereco, telefone) => {
    try {
      const sql = `CALL sp_cadastra_cliente_completo(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
      const values = [
        dadosCliente.nome,
        dadosCliente.cpf,
        dadosCliente.email,
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
}

module.exports = { clienteModel };