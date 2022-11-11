import { forwardRef, Module } from '@nestjs/common';
import { ContentModule } from '../content/content.module';
import { DatabaseModule } from '../database/database.module';
import { TrailsModule } from '../trails/trail.module';
import { ModulesController } from './module.controller';
import { moduleProvider } from './module.provider';
import { ModulesService } from './module.service';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => TrailsModule),
    forwardRef(() => ContentModule),
  ],
  providers: [...moduleProvider, ModulesService],
  controllers: [ModulesController],
  exports: [ModulesService],
})
export class ModulesModule {}
