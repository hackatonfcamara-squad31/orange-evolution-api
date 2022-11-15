import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { validate } from 'uuid';
import { ContentService } from '../content/content.service';
import { User } from '../users/entities/user.entity';
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
    const { content_id, user_id } = createCompletedDto;
    const contentStatus = await this.completedRepository.findOne({
      where: { content: { id: content_id }, user: { id: user_id } },
    });

    if (contentStatus) {
      throw new BadRequestException('Status de conteúdo já foi registrado');
    }

    const user = await this.userService.findUserById(
      createCompletedDto.user_id,
    );

    const content = await this.contentService.findById(content_id, user);

    const completed = { ...createCompletedDto, content, user };

    return this.completedRepository.save(completed);
  }

  async deleteByContentId(id: string, user: User) {
    if (!validate(id)) {
      throw new BadRequestException('Informe um ID válido.');
    }

    const contentStatus = await this.completedRepository.findOne({
      where: { content: { id }, user: { id: user.id } },
    });

    if (!contentStatus) {
      throw new NotFoundException('não existe registro do conteúdo solicitado');
    }

    return this.completedRepository.remove(contentStatus);
  }
}
