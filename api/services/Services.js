const database = require("../models");

class Services {
  constructor(nomeDoModelo) {
    this.nomeDoModelo = nomeDoModelo;
  }

  async buscaRegistro() {
    return await database[this.nomeDoModelo].findAll();
  }

  async buscarTransctionId(transactionId) {
    return await database[this.nomeDoModelo].findOne({
      where: {
        transactionId: transactionId,
      },
    });
  }

  async buscarTransctionCode(code) {
    return await database[this.nomeDoModelo].findOne({
      where: {
        code: code,
      },
    });
  }

  async buscaRegistroCart(id) {
    return await database[this.nomeDoModelo].findOne({
      where: { code: id },
    });
  }

  async criarRegistro(dados) {
    return await database[this.nomeDoModelo].create(dados);
  }

  async atualizaRegistro(dados, id) {
    const encontrado = await database[this.nomeDoModelo].update(dados, {
      where: { id: id },
    });
    if (!encontrado) {
      throw new Error("ID nao encontrado");
    }
    return encontrado;
  }

  async atualizaStatus(dados, code) {
    const encontrado = await database[this.nomeDoModelo].update(dados, {
      where: { code: code },
    });

    if (!encontrado) {
      throw new Error("code nao encontrado");
    }
    return encontrado;
  }

  async delete(id) {
    return await database[this.nomeDoModelo].destroy({
      where: { id: id },
    });
  }
}

module.exports = Services;
