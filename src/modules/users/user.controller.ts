import { Body, Controller, Post, Get } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateUserDTO } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Post()
  async create(@Body() userData: CreateUserDTO): Promise<User> {
    return this.usersService.create(userData);
  }

  @Get('me')
  getMe(@CurrentUser() user: User): User {
    return user
  }
}
