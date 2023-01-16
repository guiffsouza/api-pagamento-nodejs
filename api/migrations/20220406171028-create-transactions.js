"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cartCode: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Carts",
          key: "code",
        },
      },
      code: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          "iniciado",
          "processando",
          "pendente",
          "aprovado",
          "recusado",
          "reembolsado",
          "cancelado",
          "error"
        ),
        allowNull: false,
      },
      tipoPagamento: {
        type: Sequelize.ENUM("boleto", "cartao de credito"),
        allowNull: false,
      },
      parcelas: {
        type: Sequelize.FLOAT,
      },
      total: {
        type: Sequelize.FLOAT,
      },
      transactionId: {
        type: Sequelize.STRING,
      },
      processResponse: {
        type: Sequelize.STRING(10000),
      },
      email: {
        type: Sequelize.STRING,
      },
      nome: {
        type: Sequelize.STRING,
      },
      telefone: {
        type: Sequelize.STRING,
      },
      documento: {
        type: Sequelize.STRING,
      },
      rua: {
        type: Sequelize.STRING,
      },
      numero: {
        type: Sequelize.STRING,
      },
      bairro: {
        type: Sequelize.STRING,
      },
      cidade: {
        type: Sequelize.STRING,
      },
      estado: {
        type: Sequelize.STRING,
      },
      cep: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Transactions");
  },
};
