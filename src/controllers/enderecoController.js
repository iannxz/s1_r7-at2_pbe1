const enderecoModel = require('../models/enderecoModel');

/**
 * Controller responsável pelo gerenciamento de Endereços.
 */
const enderecoController = {

  /**
   * Adiciona um novo endereço a um cliente existente.
   * Busca os dados completos via API ViaCEP.
   * * @param {Object} req - Objeto de requisição (espera id_cliente no body ou params).
   * @param {Object} res - Objeto de resposta.
   */
  adicionarEndereco: async (req, res) => {
    try {
      const { id_cliente } = req.params;
      const { cep, numero, complemento } = req.body;

      // Validações Básicas
      if (!id_cliente) {
         res.status(400).json({ message: 'O ID do cliente é obrigatório.' });
      }

      if (!cep || cep.length !== 8) {
         res.status(400).json({ message: 'O CEP é obrigatório e deve ter 8 dígitos (apenas números).' });
      }

      const respostaViaCep = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      
      if (!respostaViaCep.ok) {
         res.status(400).json({ message: 'Falha na comunicação com o serviço de CEP' });
      }

      const dadosViaCep = await respostaViaCep.json();

      if (dadosViaCep.erro) {
        res.status(404).json({ message: 'CEP não encontrado.' });
      }

      const dadosEndereco = {
        id_cliente: id_cliente,
        cep: cep,
        rua: dadosViaCep.logradouro,
        bairro: dadosViaCep.bairro,
        cidade: dadosViaCep.localidade,
        uf: dadosViaCep.uf,
        numero: numero,
        complemento: complemento || '' // teste para nao ir undefined
      };

      await enderecoModel.insert(dadosEndereco);

      res.status(201).json({ 
        message: 'Endereço adicionado com sucesso!',
        endereco: dadosEndereco
      });

    } catch (error) {
      
      // Tratamento se o cliente não existir
      if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.errno === 1452) {
       res.status(404).json({ message: 'Cliente não encontrado. Verifique o ID informado.' });
      }

      res.status(500).json({ 
        message: 'Erro ao cadastrar endereço', 
        error: error.message 
      });
    }
  },

  /**
   * Lista todos os endereços de um cliente específico.
   */
  listarPorCliente: async (req, res) => {
    try {
        const { id_cliente } = req.params;

        if (!id_cliente) {
           res.status(400).json({ message: 'ID do cliente é obrigatório.' });
        }

        const enderecos = await enderecoModel.buscarPorCliente(id_cliente);

        if (!enderecos || enderecos.length === 0) {
         res.status(200).json({ message: 'Nenhum endereço extra encontrado para este cliente.' });
        }

        res.status(200).json(enderecos);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar endereços', error: error.message });
    }
  }
};

module.exports = enderecoController;