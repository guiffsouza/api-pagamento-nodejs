require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routers = require("./routers");

const app = express();
app.use(cors());
routers(app);
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Online em http://localhost:${port}`);
});
