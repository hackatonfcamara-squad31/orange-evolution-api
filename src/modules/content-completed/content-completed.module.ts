import { Module } from '@nestjs/common';
import { contentProvider } from '../content/content.provider';
import { ContentService } from '../content/content.service';
import { DatabaseModule } from '../database/database.module';
import { ModulesModule } from '../modules/module.module';
import { userProvider } from '../users/user.provider';
import { UsersService } from '../users/user.service';
import { completedProvider } from './completed.provider';
import { ContentCompletedController } from './content-completed.controller';
import { ContentCompletedService } from './content-completed.service';

@Module({
  imports: [DatabaseModule, ModulesModule],
  controllers: [ContentCompletedController],
  providers: [
    ...completedProvider,
    ContentCompletedService,
    ...contentProvider,
    ContentService,
    ...userProvider,
    UsersService,
  ],
  exports: [ContentCompletedService],
})
export class ContentCompletedModule {}
