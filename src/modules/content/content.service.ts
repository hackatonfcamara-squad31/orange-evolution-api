import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateContentDTO } from './dto/create-content.dto';
import { UpdateContentDTO } from './dto/update-content.dto';
import { Content } from './entities/content.entity';

@Injectable()
export class ContentService {
  constructor(
    @Inject('CONTENT_REPOSITORY')
    private contentRepository: Repository<Content>,
  ) {}

  async findById(id: number): Promise<Content> {
    const content = await this.contentRepository.findOne({
      where: { id },
    });

    if (!content) {
      throw new NotFoundException();
    }

    return content;
  }

  async findAll(): Promise<Content[]> {
    return this.contentRepository.find();
  }

  async create(createContentDTO: CreateContentDTO): Promise<Content> {
    const content = await this.contentRepository.create({
      ...createContentDTO,
    });

    return this.contentRepository.save(content);
  }

  async update(
    id: number,
    updateContentDTO: UpdateContentDTO,
  ): Promise<Content> {
    const content = await this.contentRepository.preload({
      id,
      ...updateContentDTO,
    });

    if (!content) {
      throw new NotFoundException(`Content id ${id} not found.`);
    }

    return this.contentRepository.save(content);
  }
}
