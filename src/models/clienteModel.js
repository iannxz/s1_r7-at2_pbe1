const db = require('../config/db'); 

const clienteModel  = {
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