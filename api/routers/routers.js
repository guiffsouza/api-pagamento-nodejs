const { Router } = require("express");
const controlerCarts = require("../controllers/controlerCarts");
const controlerTransactions = require("../controllers/transactionsController");
const PostbackController = require("../controllers/PostbackController");

const route = Router();
route.get("/carts", controlerCarts.buscarCarts);
route.post("/carts", controlerCarts.criarCarts);
route.put("/carts/:id", controlerCarts.atualizaCarts);
route.delete("/carts/:id", controlerCarts.deletaCarts);

route.get("/transactions", controlerTransactions.buscarTransactions);
route.post("/transactions", controlerTransactions.createTransactions);

route.post("/postback/pagarme", PostbackController.pagarme);

module.exports = route;
