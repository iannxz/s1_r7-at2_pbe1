const clienteModel = require('../models/clienteModel');

const  clienteController = {

  incluiCliente: async (req, res) => {
    try {
      const { nome, cpf, email, data_nascimento, cep, numero, complemento, telefone } = req.body;

      if (!nome || !cpf) {
        return res.status(400).json({ message: 'Nome e CPF são obrigatórios.' });
      }

      if (!cep || cep.length !== 8) {
        return res.status(400).json({ message: 'O CEP é obrigatório e deve ter 8 dígitos.' });
      }

      const respostaViaCep = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      
      if (!respostaViaCep.ok) {
        throw new Error('Falha na comunicação com o serviço de CEP');
      }

      const dadosViaCep = await respostaViaCep.json();

      if (dadosViaCep.erro) {
        return res.status(404).json({ message: 'CEP não encontrado.' });
      }

      const dadosCliente = {
        nome: nome,
        cpf: cpf.replace(/\D/g, ''),
        email: email ,
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
        id_cliente: resultado.id
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Ocorreu um erro no servidor',
        error: error.message
      });
    }
  },


deletaCliente: async (req, res) => {
    try {
      const { id } = req.params; // id do cliente a ser deletado cliente/5

 if (!id || isNaN(id)) {
        return res.status(400).json({ 
            message: 'Erro: O ID informado deve ser um número válido.' 
        });
      }
const clienteExiste = await clienteModel.verificarSeExiste(id);

      if (!clienteExiste) {
        return res.status(404).json({ 
            message: 'Erro: Cliente não encontrado para exclusão.' 
        });
      }

      // deletar se confere as etapas acima
      await clienteModel.delete(id);

      return res.status(200).json({ 
        message: 'Cliente excluído com sucesso.' 
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ 
        message: 'Erro ao excluir cliente', 
        error: error.message 
      });
    }
  },

  selecionaTodos: async (req, res) => {
    try {
      const clientes = await clienteModel.selectAll();
      
      // verificar se esta vazio antes de enviar
      if (clientes.length === 0) {
         return res.status(200).json({ message: 'Nenhum cliente cadastrado.' });
      }

      return res.status(200).json(clientes);
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ 
        message: 'Erro ao buscar clientes', 
        error: error.message 
      });
    }
  },
atualizaCliente: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, cpf, email, data_nascimento, cep, numero, complemento, telefone } = req.body;

      // Validação 
      if (!id || !nome || !cpf || !cep) {
        return res.status(400).json({ message: 'ID, Nome, CPF e CEP são obrigatórios.' });
      }

      // Busca o endereço no ViaCEP
      const respostaViaCep = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dadosViaCep = await respostaViaCep.json();

      if (dadosViaCep.erro) {
        return res.status(404).json({ message: 'CEP não encontrado.' });
      }

      const dadosCliente = {
        nome: nome,
        cpf: cpf.replace(/\D/g, ''),
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

      //atualiza
      await clienteModel.update(id, dadosCliente, dadosEndereco, telefone);

      res.status(200).json({ message: 'Cliente atualizado com sucesso!' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar', error: error.message });
    }
  },
};
  
module.exports = clienteController;