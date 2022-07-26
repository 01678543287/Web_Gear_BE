const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const { connectDB } = require("./src/config/connectDB");

dotenv.config();

const urlApi = "/api";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: false, limit: "30mb" }));

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error,
  });
});

connectDB();

// app.get('/', (req, res) => {
//   let params = req.body;
//   console.log(JSON.stringify(params))
//   return res.send('Hello World 123')
// })

//Category
app.use(`${urlApi}/category`, require("./src/api/routers/CategoryRoute"));
//User
app.use(`${urlApi}/user`, require("./src/api/routers/UserRoute"));
//Promo
app.use(`${urlApi}/promo`, require("./src/api/routers/PromoeRoute"));
//Voucher
app.use(`${urlApi}/voucher`, require("./src/api/routers/VoucherRoute"));
//History
app.use(`${urlApi}/history`, require("./src/api/routers/HistoryRoute"));
//Warehouse
app.use(`${urlApi}/warehouse`, require("./src/api/routers/WarehouseRoute"));
//Product
app.use(`${urlApi}/product`, require("./src/api/routers/ProductRoute"));

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
