const bodyParser = require("body-parser");
const route = require("./routers");

module.exports = (app) => {
  app.use(bodyParser.json(), route);

  app.use((erro, req, res, next) => {
    let status = 500;

    res.status(status).send({
      erro: erro.message,
    });
  });
};
