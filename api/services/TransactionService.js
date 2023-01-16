const Service = require("./Services");
const Cart = new Service("Carts");
const Transaction = new Service("Transactions");
const { v4: uuidv4 } = require("uuid");
const PagarMeProvider = require("../providers/pagarmeProvider");

class TransactionService {
  async process({
    cartCode,
    tipoPagamento,
    parcelas,
    cliente,
    endereco,
    creditCard,
  }) {
    const cart = await Cart.buscaRegistroCart(cartCode);

    if (!cart) {
      throw new Error("Cart Code não foi encontrado.");
    }

    const transaction = await Transaction.criarRegistro({
      cartCode: cart.code,
      code: await uuidv4(),
      total: cart.preco,
      tipoPagamento,
      parcelas,
      status: "iniciado",
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      documento: cliente.documento,
      rua: endereco.rua,
      numero: endereco.numero,
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado,
      cep: endereco.cep,
    });

    const pagamentoProvider = new PagarMeProvider();
    const response = await pagamentoProvider.process({
      transactionCode: transaction.code,
      total: transaction.total,
      tipoPagamento,
      parcelas,
      cliente,
      endereco,
      creditCard,
    });

    await Transaction.atualizaRegistro(
      {
        transactionId: response.transactionId,
        status: response.status,
        processResponse: response.processResponse,
      },
      transaction.id
    );

    return response;
  }

  async update(code, providerStatus) {
    const transaction = await Transaction.buscarTransctionCode(code);

    if (!transaction) {
      throw new Error("Codigo de transação nao foi encontrado.");
    }

    const pagamentoProvider = new PagarMeProvider();
    const status = pagamentoProvider.translateStatus(providerStatus);
    console.log("status: ", status);

    if (!status) {
      throw new Error("Status invalido.");
    }

    await Transaction.atualizaStatus({ status: status }, code);
  }
}

module.exports = new TransactionService();
