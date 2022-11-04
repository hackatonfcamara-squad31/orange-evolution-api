import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentUser } from './modules/auth/decorators/current-user.decorator';
import { IsPublic } from './modules/auth/decorators/is-public.decorator';
import { User } from './modules/users/entities/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @IsPublic()
  @Get()
  getPing(): string {
    return this.appService.getPing();
  }

  @Get('me')
  getMe(@CurrentUser() user: User): User {
    return user;
  }
}
