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
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { CreateTrailRequestDTO } from './dtos/create-trail-request.dto';
import { UpdateTrailRequestDTO } from './dtos/update-trail-request.dto';
import { Trail } from './entities/trail.entity';
import { TrailsService } from './trail.service';

@Controller('trails')
export class TrailsController {
  constructor(private trailsService: TrailsService) {}

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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() trailData: UpdateTrailRequestDTO,
  ): Promise<Trail> {
    return this.trailsService.update({ ...trailData, id });
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

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.trailsService.delete(id);
  }
}