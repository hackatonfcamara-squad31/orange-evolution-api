import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { StorageModule } from '../storage/storage.module';
import { TrailsController } from './trail.controller';
import { trailProvider } from './trail.provider';
import { TrailsService } from './trail.service';

@Module({
  imports: [DatabaseModule, StorageModule],
  providers: [...trailProvider, TrailsService],
  controllers: [TrailsController],
  exports: [TrailsService],
})
export class TrailsModule {}
