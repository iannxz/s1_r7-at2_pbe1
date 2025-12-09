const { telefoneModel } = require('../models/telefoneModel');

const telefoneController = {
    insereTelefone: async (req, res) => {
        try {
            const { idCliente, telefone } = req.body;

            if (!idCliente || !telefone || isNaN(idCliente) || isNaN(telefone)) {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente' });
            }

            if (!/^[0-9]+$/.test(telefone)) {
                return res.status(400).json({ message: 'Telefone inválido: só números são permitidos.' });
            }

            if (telefone.length > 11) {
                return res.status(400).json({ message: 'Telefone deve conter no máximo 11 dígitos.' });
            }

            const resultado = await telefoneModel.insert(idCliente, telefone);
            res.status(201).json({ message: 'Telefone incluido com sucesso', data: resultado })

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    excluirTelefone: async (req, res) => {
        try {
            const idTelefone = Number(req.params.idTelefone);

            if (!idTelefone || !Number.isInteger(idTelefone)) {
                return res.status(400).json({ message: 'Forneça um identificador válido' });
            }

            const telefoneSelecionado = await telefoneModel.selectById(idTelefone);
            if (telefoneSelecionado.length === 0) {
                return res.status(200).json({ message: 'Telefone não localizado na base de dados' });
            }

            await telefoneModel.delete(idTelefone);
            
            const telefoneDepois = await telefoneModel.selectById(idTelefone);
            if (telefoneDepois.length > 0) {
                return res.status(200).json({ message: 'Ocorreu um erro ao excluir o pedido' });
            }

            res.status(200).json({ message: 'Produto Excluido com sucesso' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
        }
}

module.exports = { telefoneController };