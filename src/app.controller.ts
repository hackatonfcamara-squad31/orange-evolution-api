import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { CurrentUser } from './modules/auth/decorators/current-user.decorator';
import { IsPublic } from './modules/auth/decorators/is-public.decorator';
import { User } from './modules/users/entities/user.entity';
import { UsersService } from './modules/users/user.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UsersService,
  ) {}

  @ApiTags('api')
  @IsPublic()
  @Get()
  getPing(): string {
    return this.appService.getPing();
  }

  @ApiTags('users')
  @Get('me')
  @ApiBearerAuth()
  getMe(@CurrentUser() user: User): Promise<User> {
    return this.userService.findUserById(user.id);
  }
}
