import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateContentDTO } from './dto/create-content.dto';
import { Content } from './entities/content.entity';

@Injectable()
export class ContentService {
  constructor(
    @Inject('CONTENT_REPOSITORY')
    private contentRepository: Repository<Content>,
  ) {}

  findAll(): Promise<Content[]> {
    return this.contentRepository.find();
  }

  async create(createContentDTO: CreateContentDTO): Promise<Content> {
    const content = await this.contentRepository.create({
      ...createContentDTO,
    });

    return this.contentRepository.save(content);
  }
}
