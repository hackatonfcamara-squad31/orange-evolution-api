import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import { unlinkSync } from 'fs';
import { getType } from 'mime';
import { resolve } from 'path';
import upload from '../../config/upload';

@Injectable()
export class CloudinaryStorageProvider {
  constructor() {
    cloudinary.v2.config(upload.storage.cloudinary);
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = resolve(upload.tmpFolder, file);

    const ContentType = getType(originalPath);

    if (!ContentType) {
      throw new Error('File not found');
    }

    const uploadImage = new Promise<string>((resolve, reject) => {
      cloudinary.v2.uploader.upload(
        originalPath,
        {
          use_filename: true,
          unique_filename: false,
        },
        async (error, result) => {
          unlinkSync(originalPath);
          if (error) return reject(error);

          let uploadUrl = '';

          if (result?.secure_url) {
            uploadUrl = result?.secure_url;
          }

          return resolve(uploadUrl);
        },
      );
    });

    return await uploadImage;
  }

  public async deleteFile(file: string): Promise<void> {
    const deleteImage = new Promise((resolve, reject) => {
      const filePath = file.split('/');
      const filePublicId = filePath[filePath.length - 1].split('.')[0];

      cloudinary.v2.uploader.destroy(
        filePublicId,
        {
          resource_type: 'image',
          invalidate: true,
        },
        (error, result) => {
          if (error) return reject(error);

          return resolve(result);
        },
      );
    });

    await deleteImage;
  }
}
