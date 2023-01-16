const Services = require("../services/Services");
const Transactions = new Services("Transactions");
const Cart = new Services("Carts");
let Yup = require("yup");
const parsePhoneNumber = require("libphonenumber-js");
const { cpf, cnpj } = require("cpf-cnpj-validator");
const TransactionService = require("../services/TransactionService");

module.exports = {
  async buscarTransactions(req, res, next) {
    try {
      const transacoes = await Transactions.buscaRegistro();
      return res.status(200).send(transacoes);
    } catch (error) {
      next(error);
    }
  },
  async createTransactions(req, res, next) {
    try {
      const {
        cartCode,
        tipoPagamento,
        parcelas,
        nome,
        email,
        telefone,
        documento,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        numeroCartao,
        dataExpiracao,
        nameCartao,
        cvv,
      } = req.body;

      const telefoneGlobal = parsePhoneNumber(telefone, "BR").format("E.164");

      const transacao = {
        cartCode: cartCode,
        tipoPagamento: tipoPagamento,
        parcelas: parcelas,
        nome: nome,
        email: email,
        telefone: telefoneGlobal,
        documento: documento,
        rua: rua,
        numero: numero,
        bairro: bairro,
        cidade: cidade,
        estado: estado,
        cep: cep,
        numeroCartao: numeroCartao,
        dataExpiracao: dataExpiracao,
        nameCartao: nameCartao,
        cvv: cvv,
      };

      const schema = Yup.object({
        cartCode: Yup.string().required(),
        tipoPagamento: Yup.mixed()
          .oneOf(["boleto", "cartao de credito"])
          .required(),
        parcelas: Yup.number()
          .min(1)
          .when("tipoPagamento", (tipoPagamento, schema) =>
            tipoPagamento === "cartao de credito"
              ? schema.max(12)
              : schema.max(1)
          ),
        nome: Yup.string().required().min(3),
        email: Yup.string().required().email(),
        telefone: Yup.string()
          .required()
          .test("is-valid-mobile", "Numero invalido.", (value) =>
            parsePhoneNumber(value, "BR").isValid()
          ),
        documento: Yup.string()
          .required()
          .test(
            "is-valid-mobile",
            "Cpf/CNPJ invalido",
            (value) => cpf.isValid(value) || cnpj.isValid(value)
          ),
        rua: Yup.string().required(),
        numero: Yup.string().required(),
        bairro: Yup.string().required(),
        cidade: Yup.string().required(),
        estado: Yup.string().required(),
        cep: Yup.string().required(),
        numeroCartao: Yup.string().when(
          "tipoPagamento",
          (tipoPagamento, schema) => {
            return tipoPagamento === "cartao de credito"
              ? schema.required()
              : schema;
          }
        ),
        dataExpiracao: Yup.string().when(
          "tipoPagamento",
          (tipoPagamento, schema) => {
            return tipoPagamento === "cartao de credito"
              ? schema.required()
              : schema;
          }
        ),
        nameCartao: Yup.string().when(
          "tipoPagamento",
          (tipoPagamento, schema) => {
            return tipoPagamento === "cartao de credito"
              ? schema.required()
              : schema;
          }
        ),
        cvv: Yup.string().when("tipoPagamento", (tipoPagamento, schema) => {
          return tipoPagamento === "cartao de credito"
            ? schema.required()
            : schema;
        }),
      });

      if (!(await schema.isValid(transacao))) {
        return res.status(400).send({ message: "Conteudo invalido." });
      }

      const cart = await Cart.buscaRegistroCart(cartCode);
      if (!cart) {
        return res.status(400).send({ message: "code invalido." });
      }

      const response = await TransactionService.process({
        cartCode,
        tipoPagamento,
        parcelas,
        cliente: {
          nome: transacao.nome,
          email: transacao.email,
          telefone: transacao.telefone,
          documento: transacao.documento,
        },
        endereco: {
          rua: transacao.rua,
          numero: transacao.numero,
          bairro: transacao.bairro,
          cidade: transacao.cidade,
          estado: transacao.estado,
          cep: cep,
        },
        creditCard: {
          numeroCartao: transacao.numeroCartao,
          dataExpiracao: transacao.dataExpiracao,
          nameCartao: transacao.nameCartao,
          cvv: transacao.cvv,
        },
      });

      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  },
};
