import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { User } from '../users/entities/user.entity';
import { ContentService } from './content.service';
import { CreateContentDTO } from './dto/create-content.dto';
import { UpdateContentDTO } from './dto/update-content.dto';
import { Content } from './entities/content.entity';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  getContents(@CurrentUser() user: User): Promise<Content[]> {
    return this.contentService.findAll(user);
  }

  @Get(':id')
  async getContentById(@Param('id') id: string): Promise<Content> {
    return this.contentService.findById(id);
  }

  @Post()
  async createContent(
    @Body() createContentDTO: CreateContentDTO,
  ): Promise<Content> {
    return this.contentService.create(createContentDTO);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContent: UpdateContentDTO,
  ): Promise<Content> {
    return this.contentService.update(id, updateContent);
  }
}
