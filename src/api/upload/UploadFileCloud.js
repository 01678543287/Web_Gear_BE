const { Storage } = require("@google-cloud/storage");
const Multer = require("multer");

const linkImage = "https://storage.googleapis.com/cloudimage123/";

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFileName: "myKey"
});
const bucket = storage.bucket("cloudimage123");

// let uploadFileImage = async (file) => {
//   try {
//     if (file) {
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       const blob = bucket.file(uniqueSuffix + file.originalname);
//       const blobStream = blob.createWriteStream();

//       blobStream.on("finish", () => {
//         return {
//           message: "success",
//           data: {
//             linkImage: linkImage + uniqueSuffix + file.originalname,
//           },
//         };
//       });
//       blobStream.end(file.buffer);
//     }
//   } catch (error) {
//     return callback(error, { data: { message: "error" } });
//   }
// };

let uploadFileImage = async (file) => {
  try {
    if (file) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const blob = bucket.file(uniqueSuffix + file.originalname);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", () => {});
      blobStream.end(file.buffer);
      return linkImage + uniqueSuffix + file.originalname;
    }
  } catch (error) {
    console.log(error, "error");
    return error;
  }
};

module.exports = {
  uploadFileImage,
  multer,
  bucket,
};
