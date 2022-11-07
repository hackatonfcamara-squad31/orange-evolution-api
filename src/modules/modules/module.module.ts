import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { ModulesController } from './module.controller';
import { moduleProvider } from './module.provider';
import { ModulesService } from './module.service';

@Module({
  imports: [DatabaseModule, StorageModule],
  providers: [...moduleProvider, ModulesService],
  controllers: [ModulesController],
  exports: [ModulesService],
})
export class ModulesModule { }
