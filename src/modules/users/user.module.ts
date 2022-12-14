import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { UsersController } from './user.controller';
import { userProvider } from './user.provider';
import { UsersService } from './user.service';

@Module({
  imports: [DatabaseModule, StorageModule],
  providers: [...userProvider, UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UserModule {}
