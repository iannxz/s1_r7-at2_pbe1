const { entregaModel } = require('../models/entregaModel');

const entregaController = {

    selecinaEntrega: async (req, res) => {
        try {
            const idPedidoEntrega = req.query.idPedidoEntrega;

            if (idPedidoEntrega) {
                const id = Number(idPedidoEntrega);

                if (isNaN(id)) {
                    return res.status(200).json({ message: 'Valor inválido de ID' });
                }

                const resultado = await entregaModel.selectById(id);

                if (resultado.length === 0) {
                    return res.status(200).json({ message: 'Pedido não localizado' });
                }

                return res.status(200).json({ data: resultado });
            }

            const resultado = await entregaModel.selectAll();

            if (resultado.length === 0) {
                return res.status(200).json({ message: 'A consulta não retornou resultado' });
            }

            return res.status(200).json(resultado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    atualizaEntrega: async (req, res) => {
        try {
            const idPedidoEntrega = Number(req.params.idPedidoEntrega);
            const { statusEntrega } = req.body;

            if (!idPedidoEntrega || !statusEntrega  || !isNaN(statusEntrega) || typeof idPedidoEntrega != 'number') {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente' });
            }

            if (statusEntrega && (statusEntrega.toUpperCase() !== "EM TRANSITO") && (statusEntrega.toUpperCase() !== "ENTREGUE") && (statusEntrega.toUpperCase() !== "CANCELADO")) {
                return res.status(400).json({ message: 'Verifique os dados é apenas considerado "EM TRANSITO" ou "ENTREGUE" OU "CANCELADO" '});
            }

            const entregaAtual = await entregaModel.selectById(idPedidoEntrega);
            if (entregaAtual.length === 0) {
                return res.status(200).json({ message: 'Entrega não localizada' })
            }

            const novoStatusEntrega = statusEntrega ?? entregaAtual[0].status_entrega;

            await entregaModel.update(idPedidoEntrega, novoStatusEntrega.toUpperCase());

            const entregaNovo = await entregaModel.selectById(idPedidoEntrega);
            if (JSON.stringify(entregaAtual) === JSON.stringify(entregaNovo)) {
                return res.status(200).json({ message: 'Não há alterações a serem realizadas' });
            }

            res.status(200).json({ message: 'Registro alterado com sucesso', entregaAtual, entregaNovo });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    }
};

module.exports = { entregaController };