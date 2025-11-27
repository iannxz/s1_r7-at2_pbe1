const clienteModel = require('../models/clienteModel');

const clienteController = {


  incluiCliente: async (req, res) => {
    try {
      const { nome, cpf, cep } = req.body;

      if ((nome && !isNaN(nome)) || (cpf && isNaN(cpf))) {
        return res.status(400).json({ message: 'Verifique os dados enviados (Nome ou CPF inválidos)' });
      }

      if (!cep || cep.length !== 8) {
        return res.status(400).json({ message: 'O CEP é obrigatório e deve ter 8 dígitos.' });
      }

      const respostaViaCep = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      
      if (!respostaViaCep.ok) {
        throw new Error('Falha na comunicação com o serviço de CEP');
      }

      const dadosEndereco = await respostaViaCep.json();

      if (dadosEndereco.erro) {
        return res.status(404).json({ message: 'CEP não encontrado na base de dados.' });
      }

      const resultado = await clienteModel.insert(
        nome, 
        cpf, 
        cep, 
        dadosEndereco.logradouro, 
        dadosEndereco.bairro, 
        dadosEndereco.localidade, 
        dadosEndereco.uf          
      );

      if (resultado.insertId === 0) {
        throw new Error("Ocorreu erro ao inserir o cliente no banco");
      }

      res.status(201).json({
        message: 'Cadastrado com sucesso',
        data: resultado,
        endereco_salvo: {
          cep: cep,
          rua: dadosEndereco.logradouro,
          cidade: dadosEndereco.localidade
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Ocorreu um erro no servidor',
        errorMessage: error.message
      });
    }
  },
};

module.exports = { clienteController };