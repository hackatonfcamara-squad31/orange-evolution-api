import { Injectable } from '@nestjs/common';
import { statSync, unlinkSync } from 'fs';
import { resolve } from 'path';
import upload from 'src/config/upload';

@Injectable()
export class DiskStorageProvider {
  public async saveFile(file: string): Promise<string> {
    return (`${process.env.API_URL}/media/${file}`);
  }
  public async deleteFile(file: string): Promise<void> {
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