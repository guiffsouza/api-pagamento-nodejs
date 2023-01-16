const { cpf } = require("cpf-cnpj-validator");
const pagarme = require("pagarme");

class PagarMeProvider {
  async process({
    transactionCode,
    total,
    tipoPagamento,
    parcelas,
    cliente,
    endereco,
    creditCard,
    itens,
  }) {
    const boletoParms = {
      payment_method: "boleto",
      amount: total * 100,
      installments: 1,
    };

    const creditCardParams = {
      payment_method: "credit_card",
      amount: total * 100,
      parcelas,
      card_holder_name: creditCard.nameCartao,
      card_number: creditCard.numeroCartao.replace(/[^?0-9]/g, ""),
      card_expiration_date: creditCard.dataExpiracao.replace(/[^?0-9]/g, ""),
      card_cvv: creditCard.cvv,
      capture: true,
    };

    let pagamentoParams;
    if (tipoPagamento === "cartao de credito") {
      pagamentoParams = creditCardParams;
    }
    if (tipoPagamento === "boleto") {
      pagamentoParams = boletoParms;
    }
    if (tipoPagamento === null) {
      throw new Error("Tipo de pagamento invalido.");
    }

    const clienteParams = {
      customer: {
        external_id: cliente.email,
        name: cliente.nome,
        email: cliente.email,
        type: cpf.isValid(cliente.documento) ? "individual" : "corporation",
        country: "br",
        phone_numbers: [cliente.telefone],
        documents: [
          {
            type: cpf.isValid(cliente.documento) ? "cpf" : "cnpj",
            number: cliente.documento.replace(/[^?0-9]/g, ""),
          },
        ],
      },
    };

    const enderecoParams = endereco?.cep
      ? {
          billing: {
            name: "Billing Address",
            address: {
              country: "br",
              state: endereco.estado,
              city: endereco.cidade,
              neighborhood: endereco.bairro,
              street: endereco.rua,
              street_number: endereco.numero,
              zipcode: endereco.cep.replace(/[^?0-9]/g, ""),
            },
          },
        }
      : {};

    const itemsParams =
      itens && itens.length > 0
        ? {
            items: itens.map((item) => ({
              id: item?.id.toString(),
              title: item?.tittle,
              unit_price: item?.amount * 100,
              quantity: item?.quantity || 1,
              tangible: false,
            })),
          }
        : {
            items: [
              {
                id: "1",
                title: `t-${transactionCode}`,
                unit_price: total * 100,
                quantity: 1,
                tangible: false,
              },
            ],
          };

    // guardar informaçõe no metadata do pagarme
    const metaParams = {
      metadata: {
        transaction_code: transactionCode,
      },
    };

    const transactionParams = {
      async: false,
      postBack: process.env.PAGARME_WEBHOOK_URL,
      ...pagamentoParams,
      ...clienteParams,
      ...enderecoParams,
      ...itemsParams,
      ...metaParams,
    };

    const client = await pagarme.client.connect({
      api_key: process.env.PAGARME_API_KEY,
    });
    const response = await client.transactions.create(transactionParams);

    console.debug("response: ", response);

    return {
      transactionId: response.id,
      status: this.translateStatus(response.status),
      boleto: {
        url: response.boleto_url,
        barCode: response.boleto_barcode,
      },
      card: {
        id: response.card?.id,
      },
      processResponse: JSON.stringify(response),
    };
  }

  translateStatus(status) {
    const statusMap = {
      processing: "processando",
      waiting_payment: "pendente",
      authorized: "pendente",
      paid: "aprovado",
      refused: "recusado",
      pending_refund: "reembolsado",
      refunded: "reembolsado",
      chargedback: "cancelado",
    };

    return statusMap[status];
  }
}

module.exports = PagarMeProvider;

// "iniciado",
// "processando",
// "pendente",
// "aprovado",
// "recusado",
// "reembolsado",
// "cancelado",
// "error";
