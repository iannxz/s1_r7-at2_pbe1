
# 🚚 Rápido & Seguro Logística - Sistema Backend <img src="https://github.com/user-attachments/assets/d088bbae-44df-40fb-bf72-b211fc45daf1" width="70px">

![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge)
![Badge Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Badge Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Badge MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

> **API RESTful** desenvolvida para gerenciar o sistema de entregas da empresa *Rápido & Seguro Logística*, automatizando cálculos de frete e gerenciamento de clientes.

---

## 📋 Sobre o Projeto

A **Rápido & Seguro Logística**, fundada em 2015, expandiu suas operações para todo o estado. Com o crescimento acelerado, o software antigo tornou-se obsoleto.

Este projeto consiste em uma solução **Backend em Node.js** robusta seguindo a arquitetura **MVC**, projetada para:
1. Gerenciar o cadastro complexo de clientes.
2. Registrar pedidos de entrega.
3. **Calcular automaticamente** os custos de frete com base em regras de negócio específicas (distância, peso, urgência e taxas).

---

## ⚙️ Funcionalidades

### 👤 Gestão de Clientes
- [x] **CRUD Completo** de Clientes.
- [x] Validação de **CPF** e **E-mail** únicos.
- [x] Suporte a múltiplos telefones e endereços por cliente.
- [x] Integração com **ViaCEP** para preenchimento automático de endereços.

### 📦 Gestão de Pedidos
- [x] Registro de pedidos vinculados a clientes.
- [x] Definição de tipo de entrega (Normal ou Urgente).
- [x] Registro de métricas (Distância em KM e Peso em KG).

### 🧮 Cálculo de Entregas (Lógica de Negócio)
O sistema calcula automaticamente o valor final baseado nas seguintes regras:

| Regra | Descrição |
| :--- | :--- |
| **Valor Base** | `(Distância × R$/Km) + (Peso × R$/Kg)` |
| **Urgência** | Se *Urgente*, **+20%** sobre o valor base. |
| **Desconto** | Se Valor Final > R$ 500,00, **-10%** de desconto. |
| **Taxa Extra** | Se Peso > 50kg, taxa fixa de **+R$ 15,00**. |

---

## 🗄️ Modelagem de Dados (DER)

O banco de dados foi modelado em **MySQL** contendo 5 tabelas principais relacionais:
`Clientes`, `Telefones`, `Enderecos`, `Pedidos`, `Entregas`.

---

## 🛠️ Tecnologias Utilizadas

* **[Node.js](https://nodejs.org/)**: Ambiente de execução Javascript.
* **[Express](https://expressjs.com/)**: Framework para criação da API.
* **[MySQL](https://www.mysql.com/)**: Banco de dados relacional.
* **[Insomnia](https://insomnia.rest/)**: Ferramenta para testes de rotas.
* **[JSDoc](https://jsdoc.app/)**: Documentação do código.

---

## 📂 Estrutura do Projeto (MVC)

```bash
📦 s1_r7-at2_pbe1
├── 📂 config/       # Configuração do DB
├── 📂 controllers/  # Lógica de controle e regras de negócio
├── 📂 models/       # Queries SQL e manipulação de dados
├── 📂 routes/       # Definição das rotas da API
├── 📂 docs/         # Documentação (DER, Script SQL, Insomnia)
├── 📄 server.js     # Ponto de entrada da aplicação
└── 📄 README.md