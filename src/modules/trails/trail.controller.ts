import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { User } from '../users/entities/user.entity';
import { CreateTrailRequestDTO } from './dtos/create-trail-request.dto';
import { TrailDescriptionResponseDTO } from './dtos/trail-description-response.dto';
import { TrailsDescriptionResponseDTO } from './dtos/trails-description-response';
import { UpdateTrailRequestDTO } from './dtos/update-trail-request.dto';
import { Trail } from './entities/trail.entity';
import { TrailsService } from './trail.service';

@ApiTags('trails')
@Controller('trails')
export class TrailsController {
  constructor(private trailsService: TrailsService) {}

  @ApiBearerAuth()
  @Post()
  @UseInterceptors(FileInterceptor('icon'))
  async create(
    @Body() trailData: CreateTrailRequestDTO,
    @UploadedFile() icon?: Express.Multer.File,
  ): Promise<Trail> {
    let iconFilename = '';

    if (icon) iconFilename = icon.filename;

    return this.trailsService.create({ ...trailData, icon: iconFilename });
  }

  @ApiBearerAuth()
  @Put('icon/:id')
  @UseInterceptors(FileInterceptor('icon'))
  async updateIcon(
    @Param('id') id: string,
    @UploadedFile() icon: Express.Multer.File,
  ): Promise<Trail> {
    let iconFilename = '';

    if (icon) iconFilename = icon.filename;

    return this.trailsService.updateIcon(id, iconFilename);
  }

  @ApiBearerAuth()
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() trailData: UpdateTrailRequestDTO,
  ): Promise<Trail> {
    return this.trailsService.update({ ...trailData, id });
  }
  
  @ApiBearerAuth()
  @Get('/description')
  async findAllTrails(
    @CurrentUser() user: User,
  ): Promise<TrailsDescriptionResponseDTO> {
    return this.trailsService.findTrailsDescription(user);
  }

  @IsPublic()
  @Get(':id')
  async find(@Param('id') id: string): Promise<Trail> {
    return this.trailsService.findById(id);
  }

  @IsPublic()
  @Get()
  async findAll(): Promise<Trail[]> {
    return this.trailsService.find();
  }

  @ApiBearerAuth()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.trailsService.delete(id);
  }

  @ApiBearerAuth()
  @Get('/description/:id')
  async getTrailDescription(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<TrailDescriptionResponseDTO> {
    return this.trailsService.description(id, user);
  }
}
