import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { ContentService } from './content.service';
import { CreateContentDTO } from './dto/create-content.dto';
import { UpdateContentDTO } from './dto/update-content.dto';
import { Content } from './entities/content.entity';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @IsPublic()
  @Get()
  getContents(): Promise<Content[]> {
    return this.contentService.findAll();
  }

  @IsPublic()
  @Get(':uuid')
  async getContentByuuid(@Param('uuid') uuid: string): Promise<Content> {
    return this.contentService.findByUuid(uuid);
  }

  @IsPublic()
  @Post()
  async createContent(
    @Body() createContentDTO: CreateContentDTO,
  ): Promise<Content> {
    return this.contentService.create(createContentDTO);
  }

  @IsPublic()
  @Patch(':uuid')
  async update(
    @Param('uuid') uuid: string,
    @Body() updateContent: UpdateContentDTO,
  ): Promise<Content> {
    return this.contentService.update(uuid, updateContent);
  }
}
