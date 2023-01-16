var fs = require("fs");
const request = require("request");
var body = JSON.parse(fs.readFileSync("body.json", "utf8"));

var options = {
  method: "POST",
  uri: "https://api.pagar.me/core/v5/orders",
  headers: {
    Authorization:
      "Basic " + Buffer.from(process.env.PAGARME_API_KEY_S).toString("base64"),
    "Content-Type": "application/json",
  },
  json: body,
};

request(options, function (error, response, body) {
  console.log(response.body);
});

const response = pagarme.client
  .connect({ api_key: process.env.PAGARME_API_KEY })
  .then((client) =>
    client.transactions.create({
      amount: 21000,
      card_number: "4111111111111111",
      card_cvv: "123",
      card_expiration_date: "0922",
      card_holder_name: "Morpheus Fishburne",
      customer: {
        external_id: "#3311",
        name: "Morpheus Fishburne",
        type: "individual",
        country: "br",
        email: "mopheus@nabucodonozor.com",
        documents: [
          {
            type: "cpf",
            number: "30621143049",
          },
        ],
        phone_numbers: ["+5511999998888", "+5511888889999"],
        birthday: "1965-01-01",
      },
      billing: {
        name: "Trinity Moss",
        address: {
          country: "br",
          state: "sp",
          city: "Cotia",
          neighborhood: "Rio Cotia",
          street: "Rua Matrix",
          street_number: "9999",
          zipcode: "06714360",
        },
      },
      shipping: {
        name: "Neo Reeves",
        fee: 1000,
        delivery_date: "2000-12-21",
        expedited: true,
        address: {
          country: "br",
          state: "sp",
          city: "Cotia",
          neighborhood: "Rio Cotia",
          street: "Rua Matrix",
          street_number: "9999",
          zipcode: "06714360",
        },
      },
      items: [
        {
          id: "r123",
          title: "Red pill",
          unit_price: 10000,
          quantity: 1,
          tangible: true,
        },
        {
          id: "b123",
          title: "Blue pill",
          unit_price: 10000,
          quantity: 1,
          tangible: true,
        },
      ],
    })
  )
  .then((transaction) => console.log(transaction));
