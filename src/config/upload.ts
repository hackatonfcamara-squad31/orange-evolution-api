import { BadRequestException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import 'dotenv/config';
import { diskStorage, FileFilterCallback, StorageEngine } from 'multer';
import { extname, resolve } from 'path';

interface UploadConfig {
  driver: 'cloudinary' | 'disk';

  multerConfig: {
    limits: {
      fileSize: number;
    };
    fileFilter: FileFilterCallback;
    storage: StorageEngine;
  };

  tmpFolder: string;

  storage: {
    disk: {};
    cloudinary: {
      cloud_name: string;
      api_key: string;
      api_secret: string;
      secure: boolean;
    };
  };
}

const tmpFolder = resolve(__dirname, '..', '..', 'uploads');

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder: tmpFolder,

  multerConfig: {
    limits: {
      fileSize: 15000000,
    },
    fileFilter: (_req, file, cb) => {
      const filetypes = /jpeg|jpg|png|gif/;

      const ext = filetypes.test(extname(file.originalname).toLowerCase());

      const mimetype = filetypes.test(file.mimetype);

      if (mimetype && ext) {
        return cb(null, true);
      } else {
        cb(new BadRequestException('Arquivo enviado não é uma imagem.'));
      }
    },
    storage: diskStorage({
      destination: tmpFolder,
      filename: (_, file, callback) => {
        const fileHash = randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },

  storage: {
    disk: {},
    cloudinary: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    },
  },
} as UploadConfig;
