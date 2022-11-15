import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { IsAdminGuard } from '../auth/guards/is-admin.guard';
import { CreateUserRequestDTO } from './dtos/create-user-request.dto';
import { UpdateUserRequestDTO } from './dtos/update-user-request.dto';
import { User } from './entities/user.entity';
import { UsersService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @IsPublic()
  @Post()
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @Body() userData: CreateUserRequestDTO,
    @UploadedFile() avatar?: Express.Multer.File,
  ): Promise<User> {
    let avatarFilename = '';

    if (avatar) avatarFilename = avatar.filename;

    return this.usersService.create({ ...userData, avatar: avatarFilename });
  }

  @Put('avatar/:id')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @Param('id') id: string,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<User> {
    let avatarFilename = '';

    if (avatar) avatarFilename = avatar.filename;

    return this.usersService.updateAvatar(id, avatarFilename);
  }

  @Delete('avatar/:id')
  @ApiBearerAuth()
  async deleteAvatar(@Param('id') id: string) {
    return this.usersService.deleteAvatar(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() userData: UpdateUserRequestDTO,
  ): Promise<User> {
    return this.usersService.update({ ...userData, id });
  }

  @Delete(':id')
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
