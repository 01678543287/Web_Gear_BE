const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");

const cloudinary = require("cloudinary").v2;
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();

const linkImage = "https://storage.googleapis.com/cloudimage123/";

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

// google cloud/storage
const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFileName: "myKey",
});
const bucket = storage.bucket("cloudimage123");

//cloudinary cloud
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

let uploadFileImageCloudinary = async (file, idImage) => {
  // return new Promise((resolve, reject) => {
  //   const uniqueSuffix =
  //     idImage + "-" + Date.now() + "-" + Math.round(Math.random() * 1e9);
  //   const nameFile = uniqueSuffix + file.originalname;
  //   cloudinary.uploader.upload(file);
  // });
  try {
    if (file) {
      const uniqueSuffix =
        idImage + "-" + Date.now() + "-" + Math.round(Math.random() * 1e9);
      const nameFile = uniqueSuffix;
      const file64 = parser.format(nameFile, file.buffer);
      const result = await cloudinary.uploader.upload(file64.content, {
        public_id: nameFile,
        folder: "DOANTHUCTAP/images",
      });
      return nameFile;
    }
  } catch (error) {
    console.log(error, "error");
    return error;
  }
};

let uploadFileImage = async (file, idImage) => {
  try {
    if (file) {
      // const uniqueSuffix = idImage + "-" + Date.now() + "-" + Math.round(Math.random() * 1e9);
      // const blob = bucket.file(uniqueSuffix + file.originalname);
      // const blobStream = blob.createWriteStream();

      // blobStream.on("finish", () => {});
      // blobStream.end(file.buffer);
      // return uniqueSuffix + file.originalname;
      console.log("upload success");
    }
  } catch (error) {
    console.log(error, "error");
    return error;
  }
};

module.exports = {
  uploadFileImageCloudinary,
  uploadFileImage,
  multer,
  bucket,
};
