import { Module } from '@nestjs/common';
import upload from 'src/config/upload';
import { CloudinaryStorageProvider } from './cloudinary-storage.provider';
import { DiskStorageProvider } from './disk-storage.provider';

const storageProvider = {
  provide: 'StorageProvider',
  useFactory: () => {
    if (upload.driver === 'cloudinary') {
      return new CloudinaryStorageProvider
    } else {
      return new DiskStorageProvider
    }
  },
};

@Module({
  imports: [],
  providers: [storageProvider],
  exports: [storageProvider],
})
export class StorageModule { }
