import { Module } from '@nestjs/common';
import { contentProvider } from '../content/content.provider';
import { DatabaseModule } from '../database/database.module';
import { completedProvider } from './completed.provider';
import { ContentCompletedController } from './content-completed.controller';
import { ContentCompletedService } from './content-completed.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ContentCompletedController],
  providers: [
    ...completedProvider,
    ContentCompletedService,
    ...contentProvider,
  ],
  exports: [ContentCompletedService],
})
export class ContentCompletedModule {}
