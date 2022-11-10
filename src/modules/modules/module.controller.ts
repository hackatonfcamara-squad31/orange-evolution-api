import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { CreateModuleRequestDTO } from './dtos/create-module-request.dto';
import { FindModulesQuery } from './dtos/find-modules-query.dto';
import { ListModuleResponse } from './dtos/list-modules-response.dto';
import { ReorderModulesDTO } from './dtos/reorder-modules.dto';
import { UpdateModuleRequestDTO } from './dtos/update-module-request.dto';
import { Module } from './entities/module.entity';
import { ModulesService } from './module.service';

@Controller('modules')
export class ModulesController {
  constructor(private modulesService: ModulesService) { }

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateModuleRequestDTO })
  @UseInterceptors(FileInterceptor('icon'))
  async create(
    @Body() moduleData: CreateModuleRequestDTO,
    @UploadedFile() icon?: Express.Multer.File,
  ): Promise<Module> {
    let iconFilename = '';

    if (icon) iconFilename = icon.filename;

    return this.modulesService.create({ ...moduleData, icon: iconFilename });
  }

  @Put('/reorder')
  @ApiBearerAuth()
  async reorder(@Body() modules: ReorderModulesDTO) {
    return this.modulesService.reorder(modules);
  }

  @Put('icon/:id')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('icon'))
  async updateIcon(
    @Param('id') id: string,
    @UploadedFile() icon: Express.Multer.File,
  ): Promise<Module> {
    let iconFilename = '';

    if (icon) iconFilename = icon.filename;

    return this.modulesService.updateIcon(id, iconFilename);
  }

  @Put(':id')
  @ApiBearerAuth()
  async update(
    @Param('id') id: string,
    @Body() moduleData: UpdateModuleRequestDTO,
  ): Promise<Module> {
    return this.modulesService.update({ ...moduleData, id });
  }

  @IsPublic()
  @Get(':id')
  async find(@Param('id') id: string): Promise<Module> {
    return this.modulesService.findById(id);
  }

  @IsPublic()
  @Get()
  async findAll(@Query() query: FindModulesQuery): Promise<ListModuleResponse> {
    return this.modulesService.find({ count: query.count, page: query.page });
  }

  @Delete(':id')
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    return this.modulesService.delete(id);
  }
}
