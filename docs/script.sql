
-- Pedidos
-- Criação de Procedure de listar pedidos

DELIMITER $$

CREATE PROCEDURE listar_pedidos()
BEGIN
SELECT * FROM pedidos;
END $$

DELIMITER ;

-- Criação de Procedure de listar pedidos por id

DELIMITER $$

CREATE PROCEDURE listar_pedido_id(IN pId INT)
BEGIN
SELECT * FROM pedidos WHERE id_pedido = pId;
END $$

DELIMITER ;

-- Verificar se o endereço é do cliente

DELIMITER $$

CREATE PROCEDURE listar_endereco_id(IN pIdEndereco INT, IN pIdCliente INT)
BEGIN
    SELECT * FROM enderecos
    WHERE id_endereco = pIdEndereco
      AND id_cliente = pIdCliente;
END $$

DELIMITER ;

-- Criação de Procedure de inserir pedido

DELIMITER $$

CREATE PROCEDURE inserir_pedido(IN pTipoEntrega VARCHAR(45), pDistancia DECIMAL(10,2), pPesoCarga DECIMAL(10,2), pValorBaseKm DECIMAL(10,2), pValorBaseKg DECIMAL(10,2), pIdCliente INT, pIdEndereco INT)
BEGIN
INSERT INTO pedidos(tipo_entrega, distancia, peso_carga, valor_base_km, valor_base_kg, id_cliente, id_endereco) VALUES
	(pTipoEntrega, pDistancia, pPesoCarga, pValorBaseKm, pValorBaseKg, pIdCliente, pIdEndereco);
END $$

DELIMITER ;

-- Criação de Procedure de alterar pedido

DELIMITER $$

CREATE PROCEDURE alterar_pedido(IN pId INT, pTipoEntrega VARCHAR(45), pDistancia DECIMAL(10,2), pPesoCarga DECIMAL(10,2), pValorBaseKm DECIMAL(10,2), pValorBaseKg DECIMAL(10,2), pIdCliente INT, pIdEndereco INT)
BEGIN
    UPDATE pedidos
    SET
        tipo_entrega = pTipoEntrega,
        distancia = pDistancia,
        peso_carga = pPesoCarga,
        valor_base_km = pValorBaseKm,
        valor_base_kg = pValorBaseKg,
        id_cliente = pIdCliente,
        id_endereco = pIdEndereco
    WHERE
        id_pedido = pId; 
END $$

DELIMITER ;



-- Entregas

-- Criação de Procedure de listar entrega

DELIMITER $$

CREATE PROCEDURE listar_entrega()
BEGIN
SELECT * FROM entregas;
END $$

DELIMITER ;


-- Criação de Procedure de listar entrega por id

DELIMITER $$

CREATE PROCEDURE listar_entrega_id(IN pId INT)
BEGIN
SELECT * FROM entregas WHERE id_pedido_entrega = pId;
END $$

DELIMITER ;



-- -------------------
-- Calculos


-- Criação de Função para calcular distancia

DELIMITER $$

CREATE FUNCTION fn_valor_distancia(pDistancia DECIMAL(10,2), pValorKm DECIMAL(10,2))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    RETURN pDistancia * pValorKm;
END $$

-- Criação de Função para calcular peeso

CREATE FUNCTION fn_valor_peso(pPeso DECIMAL(10,2), pValorKg DECIMAL(10,2))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    RETURN pPeso * pValorKg;
END $$

-- Criação de Função para calcular acrecimo

CREATE FUNCTION fn_acrescimo(pTipo VARCHAR(45), pValorBase DECIMAL(10,2))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    IF UPPER(pTipo) = 'URGENTE' THEN
        RETURN pValorBase * 0.20;
    END IF;
    RETURN 0;
END $$

-- Criação de Função para calcular desconto

CREATE FUNCTION fn_desconto(pValorFinal DECIMAL(10,2))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    IF pValorFinal > 500 THEN
        RETURN pValorFinal * 0.10;
    END IF;
    RETURN 0;
END $$

-- Criação de Função para calcular taxa extra

CREATE FUNCTION fn_taxa_extra(pPeso DECIMAL(10,2))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    IF pPeso > 50 THEN
        RETURN 15.00;
    END IF;
    RETURN 0;
END $$

-- Criação de trigger criar registro de entrega depois de um pedido criado

CREATE TRIGGER trg_cria_registro_entrega_after_create_pedido
AFTER INSERT ON pedidos
FOR EACH ROW
BEGIN
    DECLARE valorDistancia DECIMAL(10,2);
    DECLARE valorPeso DECIMAL(10,2);
    DECLARE valorBase DECIMAL(10,2);
    DECLARE valorAcrescimo DECIMAL(10,2);
    DECLARE valorDesconto DECIMAL(10,2);
    DECLARE valorTaxaExtra DECIMAL(10,2);
    DECLARE valorFinal DECIMAL(10,2);

    -- calcula distância e peso
    SET valorDistancia = fn_valor_distancia(NEW.distancia, NEW.valor_base_km);
    SET valorPeso = fn_valor_peso(NEW.peso_carga, NEW.valor_base_kg);

    -- base e acréscimo
    SET valorBase = valorDistancia + valorPeso;
    SET valorAcrescimo = fn_acrescimo(NEW.tipo_entrega, valorBase);

    -- valor antes de desconto/taxa
    SET valorFinal = valorBase + valorAcrescimo;

    -- desconto e taxa extra
    SET valorDesconto = fn_desconto(valorFinal);
    SET valorTaxaExtra = fn_taxa_extra(NEW.peso_carga);

    -- valor final definitivo
    SET valorFinal = (valorFinal - valorDesconto) + valorTaxaExtra;

    -- insere na tabela entregas
    INSERT INTO entregas(
        id_pedido_entrega,
        valor_distancia,
        valor_peso,
        acrescimo,
        desconto,
        taxa_extra,
        valor_final,
        status_entrega
    ) VALUES (
        NEW.id_pedido,
        valorDistancia,
        valorPeso,
        valorAcrescimo,
        valorDesconto,
        valorTaxaExtra,
        valorFinal,
        'CALCULADO'
    );
END $$

DELIMITER ;

-- Criação de procedure para alterar status de entrega

DELIMITER $$

CREATE PROCEDURE alterar_status_entrega(IN pId INT, pStatusEntrega VARCHAR(45))
BEGIN
UPDATE entregas
    SET
        status_entrega = pStatusEntrega
    WHERE
        id_pedido_entrega = pId; 
END $$

DELIMITER ;

-- Criação de trigger atualizar registro de entrega depois de um pedido editado

DELIMITER $$

CREATE TRIGGER trg_atualiza_registro_entrega_after_update_pedido
AFTER UPDATE ON pedidos
FOR EACH ROW
BEGIN
    DECLARE valorDistancia DECIMAL(10,2);
    DECLARE valorPeso DECIMAL(10,2);
    DECLARE valorBase DECIMAL(10,2);
    DECLARE valorAcrescimo DECIMAL(10,2);
    DECLARE valorDesconto DECIMAL(10,2);
    DECLARE valorTaxaExtra DECIMAL(10,2);
    DECLARE valorFinal DECIMAL(10,2);

    -- calcula distância e peso
    SET valorDistancia = fn_valor_distancia(NEW.distancia, NEW.valor_base_km);
    SET valorPeso = fn_valor_peso(NEW.peso_carga, NEW.valor_base_kg);

    -- base e acréscimo
    SET valorBase = valorDistancia + valorPeso;
    SET valorAcrescimo = fn_acrescimo(NEW.tipo_entrega, valorBase);

    -- valor antes de desconto/taxa
    SET valorFinal = valorBase + valorAcrescimo;

    -- desconto e taxa extra
    SET valorDesconto = fn_desconto(valorFinal);
    SET valorTaxaExtra = fn_taxa_extra(NEW.peso_carga);

    -- valor final definitivo
    SET valorFinal = (valorFinal - valorDesconto) + valorTaxaExtra;

    -- atualiza na tabela entregas
    UPDATE entregas
        SET valor_distancia = valorDistancia,
        valor_peso = valorPeso,
        acrescimo = valorAcrescimo,
        desconto = valorDesconto,
        taxa_extra = valorTaxaExtra,
        valor_final = valorFinal
	WHERE id_pedido_entrega = NEW.id_pedido;
END $$

DELIMITER ;


-- Telefone

-- Inserir mais telefones para um cliente expecifico
DELIMITER $$

CREATE PROCEDURE inserir_telefone(IN pIdCliente INT, IN pTelefone CHAR(11))
BEGIN
    INSERT INTO telefones(telefone, id_cliente) VALUES
	(pTelefone, pIdCliente);
END $$

DELIMITER ;


-- telefone expecifico

DELIMITER $$

CREATE PROCEDURE listar_telefone_id(IN pIdTelefone INT)
BEGIN
    SELECT *
    FROM telefones
    WHERE id_telefone = pIdTelefone;
END $$

DELIMITER ;


-- Deletar telefone

DELIMITER $$

CREATE PROCEDURE deletar_telefone(IN pIdTelefone INT)
BEGIN
    DELETE FROM telefones WHERE id_telefone = pIdTelefone; 	
END $$

DELIMITER ;




