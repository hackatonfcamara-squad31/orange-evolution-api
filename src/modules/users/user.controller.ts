import { Body, Controller, Post } from '@nestjs/common';
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
}
