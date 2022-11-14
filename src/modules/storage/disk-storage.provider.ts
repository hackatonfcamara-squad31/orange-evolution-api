import { Injectable } from '@nestjs/common';
import { statSync, unlinkSync } from 'fs';
import { resolve } from 'path';
import upload from '../../config/upload';

@Injectable()
export class DiskStorageProvider {
  public async saveFile(file: string): Promise<string> {
    if (file === '') return '';

    return `${process.env.API_URL}/media/${file}`;
  }
  public async deleteFile(file: string): Promise<void> {
    if (file === '') return;

    const fileName = file.split('/');

    const filePath = resolve(upload.tmpFolder, fileName[fileName.length - 1]);

    try {
      if (statSync(filePath)) {
        unlinkSync(filePath);
      }
    } catch {
      return;
    }
  }
}
