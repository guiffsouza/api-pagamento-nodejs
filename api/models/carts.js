"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Carts extends Model {
    static associate(models) {
      Carts.hasOne(models.Transactions, {
        foreignKey: "cartCode",
      });
    }
  }
  Carts.init(
    {
      code: DataTypes.STRING,
      preco: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Carts",
    }
  );
  return Carts;
};
