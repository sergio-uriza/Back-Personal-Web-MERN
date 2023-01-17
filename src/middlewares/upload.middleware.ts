import multer, { StorageEngine, Multer, FileFilterCallback } from 'multer'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import { AppError } from '../utils/appError.class'
import { Request } from 'express'

const storageAvatar: StorageEngine = multer.diskStorage({
  destination: 'public/avatar',
  filename: (_req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname).toLowerCase())
  }
})

const storageCourse: StorageEngine = multer.diskStorage({
  destination: 'public/course',
  filename: (_req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname).toLowerCase())
  }
})

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const filetypes = /jpeg|jpg|png|gif/
  const mimetype = filetypes.test(file.mimetype)
  const extname = filetypes.test(path.extname(file.originalname))
  if (mimetype && extname) {
    cb(null, true)
    return
  }
  cb(new AppError(400, 'Image file type not supported'))
}

const limits = { fileSize: 600000 }

const uploadAvatar: Multer = multer({
  storage: storageAvatar,
  limits,
  fileFilter
})

const uploadMiniature: Multer = multer({
  storage: storageCourse,
  limits,
  fileFilter
})

export const uploadSingleAvatar = uploadAvatar.single('avatar')
export const uploadSingleMiniature = uploadMiniature.single('miniature')
