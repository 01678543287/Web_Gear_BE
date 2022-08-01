const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
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

app.use(cookieParser());

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

//Upload File
// const { Storage } = require("@google-cloud/storage");
// const Multer = require("multer");

// const multer = Multer({
//   storage: Multer.memoryStorage(),
//   limits: {
//     fileSize: 2 * 1024 * 1024, // 2MB
//   },
// });

// const storage = new Storage({
//   projectId: process.env.PROJECT_ID,
//   keyFile: "myKey",
// });
// const bucket = storage.bucket("cloudimage123");
// const fileStorageEngine = Multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
// const upload = Multer({
//   storage: fileStorageEngine,single("imagefile")
// });
// const { multer, bucket } = require("./src/api/upload/UploadFileCloud");
// app.post("/upload", multer.single("imagefile"), (req, res) => {
//   try {
//     if (req.file) {
//       const blob = bucket.file(Date.now() + ":" + req.file.originalname);
//       const blobStream = blob.createWriteStream();

//       blobStream.on("finish", () => {
//         res.status(200).send("success");
//       });
//       blobStream.end(req.file.buffer);
//     }
//   } catch (error) {
//     res.status(500).send("server error");
//   }
// });

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

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
