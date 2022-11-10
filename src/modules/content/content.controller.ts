import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { ContentService } from './content.service';
import { CreateContentDTO } from './dto/create-content.dto';
import { UpdateContentDTO } from './dto/update-content.dto';
import { Content } from './entities/content.entity';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) { }

  @IsPublic()
  @Get()
  getContents(): Promise<Content[]> {
    return this.contentService.findAll();
  }

  @IsPublic()
  @Get(':id')
  async getContentById(@Param('id') id: string): Promise<Content> {
    return this.contentService.findById(id);
  }

  @IsPublic()
  @Post()
  async createContent(
    @Body() createContentDTO: CreateContentDTO,
  ): Promise<Content> {
    return this.contentService.create(createContentDTO);
  }

  @IsPublic()
  @Patch(':id')
  @ApiBody({ type: UpdateContentDTO })
  async update(
    @Param('id') id: string,
    @Body() updateContent: UpdateContentDTO,
  ): Promise<Content> {
    return this.contentService.update(id, updateContent);
  }
}
