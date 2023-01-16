const Services = require("../services/Services");
const Carts = new Services("Carts");
const { v4: uuidv4 } = require("uuid");
module.exports = {
  async buscarCarts(req, res, next) {
    try {
      const carts = await Carts.buscaRegistro();
      return res.status(200).send(carts);
    } catch (error) {
      next(error);
    }
  },

  async criarCarts(req, res, next) {
    try {
      const { code, preco } = req.body;
      const carts = await Carts.criarRegistro({ code, preco });
      return res.status(201).send(carts);
    } catch (error) {
      next(error);
    }
  },

  async atualizaCarts(req, res, next) {
    try {
      const { preco, code } = req.body;
      const { id } = req.params;
      const novoCart = await Carts.atualizaRegistro({ preco, code }, id);
      return res.status(200).send(novoCart);
    } catch (error) {
      next(error);
    }
  },

  async deletaCarts(req, res, next) {
    try {
      const { id } = req.params;
      await Carts.delete(id);
      return res.status(200).send();
    } catch (error) {
      next(error);
    }
  },
};
