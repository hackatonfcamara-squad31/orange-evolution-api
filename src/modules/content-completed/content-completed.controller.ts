import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ContentCompletedService } from './content-completed.service';
import { CreateCompletedStatusDTO } from './dtos/create-completed-status.dto';
import { Completed } from './entities/completed.entity';

@ApiTags('completed-contents')
@Controller('completed')
export class ContentCompletedController {
  constructor(
    private readonly contentCompletedService: ContentCompletedService,
  ) {}

  @ApiBearerAuth()
  @Post()
  async createCompletedStatus(
    @Body() createCompletedDto: CreateCompletedStatusDTO,
  ): Promise<Completed> {
    return this.contentCompletedService.create(createCompletedDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  async deleteCompletedStatus(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.contentCompletedService.deleteByContentId(id, user);
  }
}
