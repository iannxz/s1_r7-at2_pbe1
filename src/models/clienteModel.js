const clienteModel = require('../models/clienteModel');

const clienteController = {

  incluiCliente: async (req, res) => {
    try {
      const { nome, cpf, email, data_nascimento, cep, numero, complemento, telefone } = req.body;

      const cpfLimpo = cpf ? cpf.replace(/\D/g, '') : '';

      // validação antes do banco
      if (!nome || !cpfLimpo || !email) {
         return res.status(400).json({ message: 'Nome, CPF e Email são obrigatórios.' });
      }

      const jaExiste = await clienteModel.verificarDuplicidade(cpfLimpo, email);
    
      if (jaExiste) {
        return res.status(409).json({ message: 'Erro: CPF ou E-mail já estão cadastrados.' });
      }
    
      const dadosViaCep = { logradouro: "Rua Teste", bairro: "Bairro", localidade: "Cidade", uf: "SP" };

      const dadosCliente = {
        nome: nome,
        cpf: cpfLimpo,
        email: email,
        data_nascimento: data_nascimento
      };

      const dadosEndereco = {
        cep: cep,
        rua: dadosViaCep.logradouro, 
        bairro: dadosViaCep.bairro,
        cidade: dadosViaCep.localidade,
        uf: dadosViaCep.uf,
        numero: numero,          
        complemento: complemento 
      };

      const resultado = await clienteModel.insert(dadosCliente, dadosEndereco, telefone);

      res.status(201).json({
        message: 'Cadastrado com sucesso',
        id_cliente: resultado ? resultado.id : null
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
  },

  buscaCliente: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) return res.status(400).json({ message: 'ID é obrigatório' });

      const cliente = await clienteModel.selectById(id);

      if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
      }

      return res.status(200).json(cliente);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao buscar cliente', error: error.message });
    }
  },

  atualizaCliente: async (req, res) => {
    try {
      const { id } = req.params; 
      const { nome, email, telefone } = req.body; 

      if (!id) {
        return res.status(400).json({ message: 'ID do cliente é obrigatório.' });
      }

      const linhasAfetadas = await clienteModel.update(id, { nome, email, telefone });

      if (linhasAfetadas === 0) {
        return res.status(404).json({ message: 'Cliente não encontrado para atualização.' });
      }

      return res.status(200).json({ message: 'Cliente atualizado com sucesso.' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao atualizar cliente', error: error.message });
    }
  },

  deletaCliente: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: 'ID do cliente é obrigatório.' });
      }

      const possuiPedidos = await clienteModel.verificarSeTemPedidos(id);

      if (possuiPedidos) {
        return res.status(409).json({ 
            message: 'Operação negada: Este cliente possui pedidos registrados e não pode ser excluído.' 
        });
      }


      await clienteModel.delete(id);

      return res.status(200).json({ message: 'Cliente e dados de contato excluídos com sucesso.' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao excluir cliente', error: error.message });
    }
  }

};

module.exports = clienteController;