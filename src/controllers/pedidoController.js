const { pedidoModel } = require('../models/pedidoModel');

const pedidoController = {

    selecinaPedido: async (req, res) => {
        try {
            const idPedido = req.query.idPedido;

            if (idPedido) {
                const id = Number(idPedido);

                if (isNaN(id)) {
                    return res.status(200).json({ message: 'Valor inválido de ID' });
                }

                const resultado = await pedidoModel.selectById(id);

                if (resultado.length === 0) {
                    return res.status(200).json({ message: 'Pedido não localizado' });
                }

                return res.status(200).json({ data: resultado });
            }

            const resultado = await pedidoModel.selectAll();

            if (resultado.length === 0) {
                return res.status(200).json({ message: 'A consulta não retornou resultado' });
            }

            return res.status(200).json(resultado);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    inserePedido: async (req, res) => {
        try {
            const { tipoEntrega, distancia, pesoCarga, valorBaseKm, valorBaseKg, idCliente, idEndereco } = req.body;

            if (!tipoEntrega || !distancia || !pesoCarga || !valorBaseKm || !valorBaseKg || !idCliente || !idEndereco || !isNaN(tipoEntrega) || isNaN(distancia) || isNaN(pesoCarga) || isNaN(valorBaseKm) || isNaN(valorBaseKg) || isNaN(idCliente) || isNaN(idEndereco)) {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente' });
            }

            const enderecoClienteExiste = await pedidoModel.selectEnderecoId(idEndereco, idCliente);

            if (!enderecoClienteExiste || enderecoClienteExiste.length === 0) {
                return res.status(400).json({ message: 'O endereço informado não pertence ao cliente' });
            }

            if ((tipoEntrega.toUpperCase() !== "NORMAL") && (tipoEntrega.toUpperCase() !== "URGENTE")) {
                return res.status(400).json({ message: 'Verifique os dados é apenas considerado "normal" ou "urgente"' });
            }

            const resultado = await pedidoModel.insert(tipoEntrega.toUpperCase(), distancia, pesoCarga, valorBaseKm, valorBaseKg, idCliente, idEndereco);
            res.status(201).json({ message: 'Registro incluido com sucesso', data: resultado })

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },
    atualizaPedido: async (req, res) => {
        try {
            const idPedido = Number(req.params.idPedido);
            const { tipoEntrega, distancia, pesoCarga, valorBaseKm, valorBaseKg, idCliente, idEndereco } = req.body;

            if (!idPedido || (!tipoEntrega && !distancia && !pesoCarga && !valorBaseKm && !valorBaseKg && !idCliente && !idEndereco) || (!isNaN(tipoEntrega) && isNaN(distancia) && isNaN(pesoCarga) && isNaN(valorBaseKm) && isNaN(valorBaseKg) && isNaN(idCliente) && isNaN(idEndereco)) || typeof idPedido != 'number') {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente' });
            }

            if (tipoEntrega && (tipoEntrega.toUpperCase() !== "NORMAL") && (tipoEntrega.toUpperCase() !== "URGENTE")) {
                return res.status(400).json({ message: 'Verifique os dados é apenas considerado "normal" ou "urgente"' });
            }

            const pedidoAtual = await pedidoModel.selectById(idPedido);
            if (pedidoAtual.length === 0) {
                return res.status(200).json({ message: 'Pedido não localizado' })
            }

            const novoTipoEntrega = tipoEntrega ?? pedidoAtual[0].tipo_entrega;
            const novadistancia = distancia ?? pedidoAtual[0].distancia;
            const novoPesoCarga = pesoCarga ?? pedidoAtual[0].peso_carga;
            const novoValorBaseKm = valorBaseKm ?? pedidoAtual[0].valor_base_km;
            const novoValorBaseKg = valorBaseKg ?? pedidoAtual[0].valor_base_kg;
            const novoIdCliente = idCliente ?? pedidoAtual[0].id_cliente;
            const novoIdEndereco = idEndereco ?? pedidoAtual[0].id_endereco;

            
            const enderecoClienteExiste = await pedidoModel.selectEnderecoId(idEndereco, novoIdCliente);

            if (!enderecoClienteExiste || enderecoClienteExiste.length === 0) {
                return res.status(400).json({
                    message: 'O endereço informado não pertence ao cliente'
                });
            }


            await pedidoModel.update(idPedido, novoTipoEntrega.toUpperCase(), novadistancia, novoPesoCarga, novoValorBaseKm, novoValorBaseKg, novoIdCliente, novoIdEndereco);

            const pedidoNovo = await pedidoModel.selectById(idPedido);
            if (JSON.stringify(pedidoAtual) === JSON.stringify(pedidoNovo)) {
                return res.status(200).json({ message: 'Não há alterações a serem realizadas' });
            }

            res.status(200).json({ message: 'Registro alterado com sucesso', pedidoAtual, pedidoNovo });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    }

};

module.exports = { pedidoController };