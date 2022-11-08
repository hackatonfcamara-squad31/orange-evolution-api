import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Content } from '../content/entities/content.entity';
import { CreateCompletedStatusDTO } from './dtos/create-completed-status.dto';
import { Completed } from './entities/completed.entity';

@Injectable()
export class ContentCompletedService {
  constructor(
    @Inject('COMPLETED_REPOSITORY')
    private readonly completedRepository: Repository<Completed>,
    @Inject('CONTENT_REPOSITORY')
    private readonly contentRepository: Repository<Content>,
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

    const content = await this.contentRepository.findOne({
      where: { id: content_id },
    });

    if (!content) {
      throw new NotFoundException('não existe registro do conteúdo solicitado');
    }

    const completed = { ...createCompletedDto, content };

    return this.completedRepository.save(completed);
  }

  async deleteByContentId(id: string) {
    const contentStatus = await this.completedRepository.findOne({
      where: { content: { id } },
    });

    if (!contentStatus) {
      throw new BadRequestException(
        'não existe registro do conteúdo solicitado',
      );
    }

    return this.completedRepository.remove(contentStatus);
  }
}
