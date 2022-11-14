import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IsAdminGuard } from '../auth/guards/is-admin.guard';
import { User } from '../users/entities/user.entity';
import { ContentService } from './content.service';
import { CreateContentDTO } from './dto/create-content.dto';
import { UpdateContentDTO } from './dto/update-content.dto';
import { Content } from './entities/content.entity';

@ApiTags('contents')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) { }

  @Get()
  @ApiBearerAuth()
  getContents(@CurrentUser() user: User): Promise<Content[]> {
    return this.contentService.findAll(user);
  }

  @ApiBearerAuth()
  @Get(':id')
  async getContentById(@CurrentUser() user: User, @Param('id') id: string): Promise<Content> {
    return this.contentService.findById(id, user);
  }

  @ApiBearerAuth()
  @UseGuards(IsAdminGuard)
  @Post()
  async createContent(
    @Body() createContentDTO: CreateContentDTO,
  ): Promise<Content> {
    return this.contentService.create(createContentDTO);
  }

  @ApiBearerAuth()
  @UseGuards(IsAdminGuard)
  @Patch(':id')
  @ApiBody({ type: UpdateContentDTO })
  async update(
    @Param('id') id: string,
    @Body() updateContent: UpdateContentDTO,
  ): Promise<Content> {
    return this.contentService.update(id, updateContent);
  }

  @ApiBearerAuth()
  @UseGuards(IsAdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.contentService.delete(id);
  }
}
