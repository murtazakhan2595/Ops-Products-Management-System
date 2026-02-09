import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { uploadController } from './upload.controller.js';
import { uploadService } from './upload.service.js';
import { AppError } from '../../core/errors/app-error.js';
import { ErrorCodes } from '../../core/errors/error-codes.js';

const router = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadService.getUploadPath());
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(AppError.badRequest(ErrorCodes.INVALID_FILE_TYPE, 'Only JPEG, PNG, and WebP images are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post('/', upload.single('image'), uploadController.uploadImage);

export { router as uploadRoutes };
