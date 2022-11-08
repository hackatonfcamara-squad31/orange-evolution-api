import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCompletedStatusDTO } from './dtos/create-completed-status.dto';
import { Completed } from './entities/completed.entity';

@Injectable()
export class ContentCompletedService {
  constructor(
    @Inject('COMPLETED_REPOSITORY')
    private readonly completedRepository: Repository<Completed>,
  ) {}

  async create(
    createCompletedDto: CreateCompletedStatusDTO,
  ): Promise<Completed> {
    const { content_id } = createCompletedDto;
    const contentStatus = await this.completedRepository.findOne({
      where: { content_id: content_id },
    });

    if (contentStatus) {
      throw new BadRequestException('Status de conteúdo já foi registrado');
    }

    return this.completedRepository.save(createCompletedDto);
  }

  async deleteByContentId(id: string) {
    const contentStatus = await this.completedRepository.findOne({
      where: { content_id: id },
    });

    if (!contentStatus) {
      throw new BadRequestException(
        'não existe registro do conteúdo solicitado',
      );
    }

    return this.completedRepository.remove(contentStatus);
  }
}
