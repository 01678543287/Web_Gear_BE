const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const stripe = require("stripe");
const port = process.env.PORT || 8000;
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

app.use(cookieParser());

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error,
  });
});

connectDB();

//Category
app.use(`${urlApi}/category`, require("./src/api/routers/CategoryRoute"));
//User
app.use(`${urlApi}/user`, require("./src/api/routers/UserRoute"));
//Admin
app.use(`${urlApi}/admin`, require("./src/api/routers/AdminRoute"));
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
//Cart
app.use(`${urlApi}/cart`, require("./src/api/routers/CartRoute"));
//Search
app.use(`${urlApi}/search`, require("./src/api/routers/SearchRoute"));
//Checkout
app.use(`${urlApi}/checkout`, require("./src/api/routers/CheckoutRoute"));
//Order
app.use(`${urlApi}/order`, require("./src/api/routers/OrderRoute"));
//Transaction
app.use(`${urlApi}/transaction`, require("./src/api/routers/TransactionRoute"));
//Ribbon
app.use(`${urlApi}/ribbon`, require("./src/api/routers/RibbonRoute"));
//Chart
app.use(`${urlApi}/chart`, require("./src/api/routers/ChartRoute"));

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
