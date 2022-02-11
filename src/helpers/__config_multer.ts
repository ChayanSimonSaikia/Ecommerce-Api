import multer, { FileFilterCallback } from "multer";
import path from "path";
import moment from "moment";
import crypto from "crypto";
import { Application, Request } from "express";

const ProductImagestorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "..", "/images/product-images"));
  },
  filename: (req, { filename }, callback) => {
    /* Converting to 8 bytes string */
    const fname =
      filename.length >= 8
        ? filename.slice(0, 7)
        : `${filename.slice(0, filename.length - 1)}${crypto
            .randomBytes((8 - filename.length) / 2)
            .toString("hex")}`;

    callback(
      null,
      /* filename */ `${fname}-${moment().format("DDMMYYYYhhmmss")}`
    );
  },
});

const imageFilterFormat = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

export const multerImageUpload = (app: Application) => {
  return app.use(
    multer({
      storage: ProductImagestorage,
      fileFilter: imageFilterFormat,
    }).single("image")
  );
};
