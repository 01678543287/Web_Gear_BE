const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: "myKey",
});
const bucket = storage.bucket("web_gear");

let uploadFileImage = (file) => {

}
