import { Module } from '@nestjs/common';
import { completedProvider } from '../content-completed/completed.provider';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from '../users/user.module';
import { ContentController } from './content.controller';
import { contentProvider } from './content.provider';
import { ContentService } from './content.service';

@Module({
  imports: [DatabaseModule, UserModule],
  providers: [...contentProvider, ContentService, ...completedProvider],
  controllers: [ContentController],
  exports: [ContentService],
})
export class ContentModule {}
