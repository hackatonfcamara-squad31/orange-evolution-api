import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { IsAdminGuard } from '../auth/guards/is-admin.guard';
import { User } from '../users/entities/user.entity';
import { CreateModuleRequestDTO } from './dtos/create-module-request.dto';
import { FindModulesQuery } from './dtos/find-modules-query.dto';
import { ListModuleResponse } from './dtos/list-modules-response.dto';
import { ModuleDescriptionResponseDTO } from './dtos/module-desciption-response.dto';
import { ReorderModulesDTO } from './dtos/reorder-modules.dto';
import { UpdateModuleRequestDTO } from './dtos/update-module-request.dto';
import { Module } from './entities/module.entity';
import { ModulesService } from './module.service';

@ApiTags('modules')
@Controller('modules')
export class ModulesController {
  constructor(private modulesService: ModulesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(IsAdminGuard)
  @ApiBody({ type: CreateModuleRequestDTO })
  async create(@Body() moduleData: CreateModuleRequestDTO): Promise<Module> {
    return this.modulesService.create(moduleData);
  }

  @Put('/reorder')
  @UseGuards(IsAdminGuard)
  @ApiBearerAuth()
  async reorder(@Body() modules: ReorderModulesDTO) {
    return this.modulesService.reorder(modules);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(IsAdminGuard)
  async update(
    @Param('id') id: string,
    @Body() moduleData: UpdateModuleRequestDTO,
  ): Promise<Module> {
    return this.modulesService.update({ ...moduleData, id });
  }

  @Get('/description/:id')
  @ApiBearerAuth()
  async getModuleDescription(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<ModuleDescriptionResponseDTO> {
    return this.modulesService.description(id, user);
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

  @Delete('/:id')
  @UseGuards(IsAdminGuard)
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    return this.modulesService.delete(id);
  }
}
