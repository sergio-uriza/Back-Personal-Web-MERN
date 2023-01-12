import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { AppError } from "../utils/appError.class";

const storage = multer.diskStorage({
  destination: "public/uploads",
  filename: (_req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname).toLowerCase());
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter: (_req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname));
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new AppError(400, 'Image file type not supported'));
  }
});

export const uploadAvatar = upload.single('avatar');

export default upload;
