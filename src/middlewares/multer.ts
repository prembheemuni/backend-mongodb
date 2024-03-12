import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "uploads");
  },
  filename(req, file, callback) {
    const extension = file.originalname.split(".").pop();
    const id = uuid();
    callback(null, `${id}.${extension}`);
  },
});

export const singleUpload = multer({ storage }).single("photo");
