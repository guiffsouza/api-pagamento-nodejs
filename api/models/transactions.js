"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transactions extends Model {
    static associate(models) {
      Transactions.belongsTo(models.Carts, {
        foreignKey: "cartCode",
      });
    }
  }
  Transactions.init(
    {
      cartCode: DataTypes.STRING,
      code: DataTypes.STRING,
      status: DataTypes.ENUM(
        "iniciado",
        "processando",
        "pendente",
        "aprovado",
        "recusado",
        "reembolsado",
        "cancelado",
        "error"
      ),
      tipoPagamento: DataTypes.ENUM("boleto", "cartao de credito"),
      parcelas: DataTypes.FLOAT,
      total: DataTypes.FLOAT,
      transactionId: DataTypes.STRING,
      processResponse: DataTypes.STRING,
      email: DataTypes.STRING,
      nome: DataTypes.STRING,
      telefone: DataTypes.STRING,
      documento: DataTypes.STRING,
      rua: DataTypes.STRING,
      numero: DataTypes.STRING,
      bairro: DataTypes.STRING,
      cidade: DataTypes.STRING,
      estado: DataTypes.STRING,
      cep: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Transactions",
    }
  );
  return Transactions;
};
