import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import upload from './config/upload';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { ModulesModule } from './modules/modules/module.module';
import { StorageModule } from './modules/storage/storage.module';
import { UserModule } from './modules/users/user.module';
import { ContentModule } from './modules/content/content.module';
import { TrailsModule } from './modules/trails/trail.module';
import { ContentCompletedModule } from './modules/content-completed/content-completed.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    ContentModule,
    ContentCompletedModule,
    ModulesModule,
    TrailsModule,
    MulterModule.register(upload.multerConfig),
    StorageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [MulterModule],
})
export class AppModule {}
