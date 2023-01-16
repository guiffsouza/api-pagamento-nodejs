const Service = require("../services/Services");
const Transactions = new Service("Transactions");
const TransactionService = require("../services/TransactionService");
class PostbackController {
  async pagarme(req, res, next) {
    const { id, object, current_status } = req.body;

    try {
      if (object === "transaction") {
        const transaction = await Transactions.buscarTransctionId(id);
        if (!transaction) {
          return res.status(404).send();
        }

        await TransactionService.update(transaction.code, current_status);
      }

      return res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostbackController();
