import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from '../../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UploadService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(__dirname, '../../..', env.UPLOAD_DIR);
    this.ensureUploadDir();
  }

  private ensureUploadDir() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  getUploadPath() {
    return this.uploadDir;
  }

  getFileUrl(filename: string) {
    return `/uploads/${filename}`;
  }

  deleteFile(filename: string) {
    const filePath = path.join(this.uploadDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

export const uploadService = new UploadService();
