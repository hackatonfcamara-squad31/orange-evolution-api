import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { ContentCompletedService } from './content-completed.service';
import { CreateCompletedStatusDTO } from './dtos/create-completed-status.dto';
import { Completed } from './entities/completed.entity';

@Controller('completed')
export class ContentCompletedController {
  constructor(
    private readonly contentCompletedService: ContentCompletedService,
  ) {}

  @IsPublic()
  @Post()
  async createCompletedStatus(
    @Body() createCompletedDto: CreateCompletedStatusDTO,
  ): Promise<Completed> {
    return this.contentCompletedService.create(createCompletedDto);
  }

  @IsPublic()
  @Delete(':id')
  async deleteCompletedStatus(@Param('id') id: string) {
    return this.contentCompletedService.deleteByContentId(id);
  }
}
