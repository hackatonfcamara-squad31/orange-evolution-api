import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ContentController } from './content.controller';
import { contentProvider } from './content.provider';
import { ContentService } from './content.service';

@Module({
  imports: [DatabaseModule],
  providers: [...contentProvider, ContentService],
  controllers: [ContentController],
  exports: [ContentService],
})
export class ContentModule {}
