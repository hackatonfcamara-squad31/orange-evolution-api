import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { validate } from 'uuid';
import { ContentService } from '../content/content.service';
import { UsersService } from '../users/user.service';
import { CreateCompletedStatusDTO } from './dtos/create-completed-status.dto';
import { Completed } from './entities/completed.entity';

@Injectable()
export class ContentCompletedService {
  constructor(
    @Inject('COMPLETED_REPOSITORY')
    private completedRepository: Repository<Completed>,
    private readonly contentService: ContentService,
    private readonly userService: UsersService,
  ) {}

  async create(
    createCompletedDto: CreateCompletedStatusDTO,
  ): Promise<Completed> {
    const { content_id } = createCompletedDto;
    const contentStatus = await this.completedRepository.findOne({
      where: { content: { id: content_id } },
    });

    if (contentStatus) {
      throw new BadRequestException('Status de conteúdo já foi registrado');
    }

    const content = await this.contentService.findById(content_id);
    const user = await this.userService.findUserById(
      createCompletedDto.user_id,
    );

    const completed = { ...createCompletedDto, content, user };

    return this.completedRepository.save(completed);
  }

  async deleteByContentId(id: string) {
    if (!validate(id)) {
      throw new BadRequestException('Informe um ID válido.');
    }

    const contentStatus = await this.completedRepository.findOne({
      where: { content: { id } },
    });

    if (!contentStatus) {
      throw new NotFoundException('não existe registro do conteúdo solicitado');
    }

    return this.completedRepository.remove(contentStatus);
  }
}
