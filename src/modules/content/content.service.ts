import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { validate } from 'uuid';
import { Completed } from '../content-completed/entities/completed.entity';
import { ModulesService } from '../modules/module.service';
import { User } from '../users/entities/user.entity';
import { CreateContentDTO } from './dto/create-content.dto';
import { ReorderContentDTO } from './dto/reorder-content-dto';
import { ResponseContentDTO } from './dto/response-content.dto';
import { UpdateContentDTO } from './dto/update-content.dto';
import { Content } from './entities/content.entity';

@Injectable()
export class ContentService {
  constructor(
    @Inject('CONTENT_REPOSITORY')
    private contentRepository: Repository<Content>,
    @Inject('COMPLETED_REPOSITORY')
    private completedRepository: Repository<Completed>,
    @Inject(forwardRef(() => ModulesService))
    private modulesService: ModulesService,
  ) {}

  async findById(id: string, user?: User): Promise<Content> {
    if (!validate(id)) {
      throw new BadRequestException('Informe um ID válido.');
    }

    const content = await this.contentRepository.findOne({
      where: { id },
    });

    console.log(content);

    if (!content) {
      throw new NotFoundException(`Conteúdo com ID ${id} não encontrado`);
    }

    const completed: Completed = await this.completedRepository
      .createQueryBuilder('completed')
      .where('completed.user.id = :id', { id: user.id })
      .where('completed.content.id = :id', { id: content.id })
      .getOne();

    const contentResponse = {
      ...content,
      is_completed: false,
    };

    delete contentResponse.completed;

    if (completed) {
      contentResponse.is_completed = true;
    }

    return contentResponse;
  }

  async findAll(user: User): Promise<ResponseContentDTO[]> {
    const contents = await this.contentRepository.find();
    const completedContents = await this.getCompletedContents(user.id);

    const response: ResponseContentDTO[] = contents.map((content) => {
      return {
        ...content,
        is_completed: completedContents.includes(content.id),
      };
    });
    return response;
  }

  async create(createContentDTO: CreateContentDTO): Promise<Content> {
    const contentExists = await this.contentRepository.findOne({
      where: {
        order: createContentDTO.order,
        module: { id: createContentDTO.module_id },
      },
    });

    if (contentExists) {
      throw new BadRequestException(
        'Já existe um onteúdo nessa posição. Você precisa reordenar os conteúdos.',
      );
    }

    const module = await this.modulesService.findById(
      createContentDTO.module_id,
    );

    if (!module)
      throw new NotFoundException('O módulo selecionado não foi encontrado');

    const content = this.contentRepository.create({
      ...createContentDTO,
      module: module,
    });

    return await this.contentRepository.save(content);
  }

  async update(
    id: string,
    updateContentDTO: UpdateContentDTO,
  ): Promise<Content> {
    const module = await this.modulesService.findById(
      updateContentDTO.module_id,
    );

    if (!module)
      throw new NotFoundException('O módulo selecionado não foi encontrado');

    const content = await this.contentRepository.preload({
      id,
      ...updateContentDTO,
      module: module,
    });

    if (!content) {
      throw new NotFoundException(`Conteúdo com ID ${id} não encontrado`);
    }

    return this.contentRepository.save(content);
  }

  async getCompletedContents(id: string): Promise<string[]> {
    if (!validate(id)) {
      throw new BadRequestException('Informe um ID válido.');
    }

    const contents: Completed[] = await this.completedRepository
      .createQueryBuilder('completed')
      .select('completed.content')
      .where('completed.user.id = :id', { id })
      .getRawMany();

    const result = contents.map((completed) => completed['content_id']);

    return result;
  }

  async count(id: string): Promise<number> {
    const count: number = await this.contentRepository
      .createQueryBuilder('content')
      .where('content.module.id = :id', { id })
      .getCount();
    return count;
  }

  async countCompleted(moduleId: string, userId: string): Promise<number> {
    const count: number = await this.contentRepository
      .createQueryBuilder('content')
      .innerJoin('content.completed', 'completed')
      .where('content.module.id = :moduleId', { moduleId })
      .andWhere('completed.user.id = :userId', { userId })
      .getCount();

    return count;
  }

  async listModuleContents(
    id: string,
    user: User,
  ): Promise<ResponseContentDTO[]> {
    const contents: Content[] = await this.contentRepository.find({
      where: { module: { id } },
    });

    const completedContents = await this.getCompletedContents(user.id);

    const response: ResponseContentDTO[] = contents.map((content) => {
      return {
        ...content,
        is_completed: completedContents.includes(content.id),
      };
    });

    return response;
  }

  async delete(id: string, module_id: string): Promise<void> {
    const deletedContent = await this.contentRepository.findOne({
      where: { id },
    });

    if (!deletedContent)
      throw new NotFoundException('Conteúdo não encontrado.');

    await this.contentRepository.delete(id);

    const allContents = await this.contentRepository.find({
      where: {
        order: MoreThan(deletedContent.order),
        module: { id: module_id },
      },
      order: { order: 'ASC' },
    });

    const contentUpdatePromises = allContents.map(async (content, index) => {
      const position = deletedContent.order + index;
      await this.contentRepository.update(
        { id: content.id },
        { ...content, order: position },
      );
    });

    await Promise.all(contentUpdatePromises);
  }

  async reorder({ id, order, module_id }: ReorderContentDTO) {
    const allContents = await this.contentRepository.find({
      where: { module: { id: module_id } },
    });

    const contentExists = allContents.filter((content) => content.id === id)[0];
    const contentReplaced = allContents.filter((content) => content.order)[0];

    if (!contentExists) {
      throw new BadRequestException(
        'O conteúdo especificado não existe. Verifique os dados novamente.',
      );
    }

    await this.contentRepository.update(
      { id: contentExists.id },
      { ...contentExists, order: null },
    );

    await this.contentRepository.update(
      { id: contentReplaced.id },
      { ...contentReplaced, order: null },
    );

    if (contentExists.order < order) {
      const afterContents = allContents.filter(
        (content) =>
          content.order > contentExists.order && content.order <= order,
      );

      const afterContentsPromises = afterContents.map(async (afterContent) => {
        await this.contentRepository.update(
          { id: afterContent.id },
          { ...afterContent, order: afterContent.order - 1 },
        );
      });

      await this.contentRepository.update(
        { id: contentExists.id },
        { ...contentExists, order: order },
      );

      await Promise.all(afterContentsPromises);
    } else {
      const beforeContents = allContents.filter(
        (content) =>
          content.order < contentExists.order && content.order > order,
      );

      const beforeContentsPromises = beforeContents
        .reverse()
        .map(async (beforeContent) => {
          await this.contentRepository.update(
            { id: beforeContent.id },
            { ...beforeContent, order: beforeContent.order + 1 },
          );
        });

      await this.contentRepository.update(
        { id: contentExists.id },
        { ...contentExists, order: order },
      );

      await this.contentRepository.update(
        { id: contentReplaced.id },
        { ...contentReplaced, order: order + 1 },
      );

      await Promise.all(beforeContentsPromises);
    }
  }
}
