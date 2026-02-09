import type { Request, Response, NextFunction } from 'express';
import { uploadService } from './upload.service.js';
import { sendSuccess } from '../../core/utils/response.js';
import { AppError } from '../../core/errors/app-error.js';
import { ErrorCodes } from '../../core/errors/error-codes.js';

class UploadController {
  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw AppError.badRequest(ErrorCodes.UPLOAD_FAILED, 'No file uploaded');
      }

      const url = uploadService.getFileUrl(req.file.filename);
      sendSuccess(res, { url, filename: req.file.filename }, 201);
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();
