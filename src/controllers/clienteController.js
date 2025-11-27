const { clienteModel } = require('../models/clienteModel');

const  clienteController = {

  incluiCliente: async (req, res) => {
    try {
      const { nome, cpf, email, cep, numero, complemento, telefone } = req.body;

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
        email: email 
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
};

module.exports = { clienteController };