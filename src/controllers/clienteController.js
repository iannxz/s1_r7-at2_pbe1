const clienteModel = require('../models/clienteModel');

const  clienteController = {

 incluiCliente: async (req, res) => {
    try {
      const { nome, cpf, email, data_nascimento, cep, numero, complemento, telefone } = req.body;

      // retirar os pontos do cpf
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
};

module.exports = clienteController;