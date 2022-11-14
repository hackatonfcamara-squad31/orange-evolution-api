import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ModulesModule } from '../modules/module.module';
import { StorageModule } from '../storage/storage.module';
import { TrailsController } from './trail.controller';
import { trailProvider } from './trail.provider';
import { TrailsService } from './trail.service';

@Module({
  imports: [DatabaseModule, StorageModule, forwardRef(() => ModulesModule)],
  providers: [...trailProvider, TrailsService],
  controllers: [TrailsController],
  exports: [TrailsService],
})
export class TrailsModule {}
