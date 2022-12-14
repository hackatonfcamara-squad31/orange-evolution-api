import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { ContentService } from '../content/content.service';
import { Trail } from '../trails/entities/trail.entity';
import { TrailsService } from '../trails/trail.service';
import { User } from '../users/entities/user.entity';
import { CreateModuleDTO } from './dtos/create-module.dto';
import { FindModulesQuery } from './dtos/find-modules-query.dto';
import { ListModuleResponse } from './dtos/list-modules-response.dto';
import { ModuleDescriptionResponseDTO } from './dtos/module-desciption-response.dto';
import { ReorderModulesDTO } from './dtos/reorder-modules.dto';
import { UpdateModuleDTO } from './dtos/update-module.dto';
import { Module } from './entities/module.entity';

@Injectable()
export class ModulesService {
  constructor(
    @Inject('MODULE_REPOSITORY')
    private modulesRepository: Repository<Module>,

    @Inject(forwardRef(() => TrailsService))
    private trailsService: TrailsService,

    @Inject(forwardRef(() => ContentService))
    private contentService: ContentService,
  ) {}

  async create({
    title,
    description,
    order,
    trail,
  }: CreateModuleDTO): Promise<Module> {
    const moduleInposition = await this.modulesRepository.findOne({
      where: { order, trail: { id: trail } },
    });

    if (moduleInposition) {
      throw new BadRequestException(
        'Já existe um módulo nessa posição. Você precisa reordenar os módulos.',
      );
    }

    const trailExists = await this.trailsService.findById(trail);

    if (!trailExists)
      throw new NotFoundException('A trilha selecionada não foi encontrada');

    const module = this.modulesRepository.create({
      title,
      description,
      order,
      trail: trailExists,
    });

    return await this.modulesRepository.save(module);
  }

  async update({ id, title, description }: UpdateModuleDTO): Promise<Module> {
    const module = await this.modulesRepository.findOne({ where: { id } });

    if (!module) throw new NotFoundException('Módulo não encontrado.');

    await this.modulesRepository.update(
      { id: module.id },
      {
        ...module,
        title,
        description,
      },
    );

    return {
      ...module,
      title,
      description,
    };
  }

  async reorder({ id, order, trail_id }: ReorderModulesDTO): Promise<void> {
    const allModules = await this.modulesRepository.find({
      where: { trail: { id: trail_id } },
    });

    const moduleExists = allModules.filter((module) => module.id === id)[0];
    const moduleReplaced = allModules.filter(
      (module) => module.order === order,
    )[0];

    if (!moduleExists)
      throw new BadRequestException(
        'O módulo especificado não existe. Verifique os dados novamente.',
      );

    await this.modulesRepository.update(
      { id: moduleExists.id },
      { ...moduleExists, order: null },
    );

    await this.modulesRepository.update(
      { id: moduleReplaced.id },
      { ...moduleReplaced, order: null },
    );

    if (moduleExists.order < order) {
      const afterModules = allModules.filter(
        (module) => module.order > moduleExists.order && module.order <= order,
      );

      const afterModulesPromises = afterModules.map(async (afterModule) => {
        await this.modulesRepository.update(
          { id: afterModule.id },
          { ...afterModule, order: afterModule.order - 1 },
        );
      });

      await this.modulesRepository.update(
        { id: moduleExists.id },
        { ...moduleExists, order: order },
      );

      await Promise.all(afterModulesPromises);
    } else {
      const beforeModules = allModules.filter(
        (module) => module.order < moduleExists.order && module.order > order,
      );

      const beforeModulesPromises = beforeModules
        .reverse()
        .map(async (beforeModule) => {
          await this.modulesRepository.update(
            { id: beforeModule.id },
            { ...beforeModule, order: beforeModule.order + 1 },
          );
        });

      await this.modulesRepository.update(
        { id: moduleExists.id },
        { ...moduleExists, order: order },
      );

      await this.modulesRepository.update(
        { id: moduleReplaced.id },
        { ...moduleReplaced, order: order + 1 },
      );

      await Promise.all(beforeModulesPromises);
    }
  }

  async findById(id: string): Promise<Module> {
    const module = await this.modulesRepository.findOne({ where: { id } });

    if (!module) throw new NotFoundException('Módulo não encontrado.');

    return module;
  }

  async find({ count, page }: FindModulesQuery): Promise<ListModuleResponse> {
    if (count && page) {
      page = page - 1;

      if (page < 0)
        throw new BadRequestException(
          'Número da página deve ser maior que zero.',
        );

      if (count < 0)
        throw new BadRequestException(
          'Quantidade de itens deve ser maior que zero.',
        );

      const skip = page * count;
      const [modules, total] = await this.modulesRepository.findAndCount({
        order: { order: 'ASC' },
        take: count,
        skip,
      });

      let next = false;

      const totalPages = Math.floor(total / count);

      if (page < totalPages - 1) next = true;

      if (modules.length === 0)
        throw new BadRequestException(
          'Nenhum módulo encontrado para os filtros selecionados.',
        );

      return { modules, next };
    }

    const modules = await this.modulesRepository.find({
      order: { order: 'ASC' },
    });

    return { modules };
  }

  async delete(id: string): Promise<void> {
    const deletedModule = await this.modulesRepository.findOne({
      where: { id },
      relations: ['trail'],
    });

    if (!deletedModule) throw new NotFoundException('Módulo não encontrado.');

    await this.modulesRepository.delete(id);

    const allModules = await this.modulesRepository.find({
      where: {
        order: MoreThan(deletedModule.order),
        trail: { id: deletedModule.trail.id },
      },
      order: { order: 'ASC' },
    });

    const moduleUpdatePromises = allModules.map(async (module, index) => {
      const position = deletedModule.order + index;
      await this.modulesRepository.update(
        { id: module.id },
        { ...module, order: position },
      );
    });

    await Promise.all(moduleUpdatePromises);
  }

  async description(
    id: string,
    user: User,
  ): Promise<ModuleDescriptionResponseDTO> {
    const module: Module = await this.modulesRepository.findOne({
      where: { id },
    });

    if (!module) {
      throw new NotFoundException('Módulo não encontrado.');
    }

    const trail: Trail = await this.trailsService.findByModuleId(id);
    const contents = await this.contentService.listModuleContents(id, user);
    const total = await this.contentService.count(id);
    const completed = await this.contentService.countCompleted(id, user.id);

    const description: ModuleDescriptionResponseDTO = {
      trail_id: trail.id,
      trail_title: trail.title,
      module,
      contents,
      total,
      completed,
    };

    return description;
  }

  async listModules(id: string): Promise<Module[]> {
    const modules: Module[] = await this.modulesRepository.find({
      where: { trail: { id } },
    });
    return modules;
  }

  async count(
    id: string,
    user: User,
  ): Promise<{ completed: number; total: number }> {
    const modules: Module[] = await this.listModules(id);

    const count = await Promise.all(
      modules.map(async (module) => {
        const completed = await this.contentService.countCompleted(
          module.id,
          user.id,
        );
        const total = await this.contentService.count(module.id);
        return { completed, total };
      }),
    );

    const result = count.reduce(
      (acc, val) => {
        return {
          completed: (acc.completed += val.completed),
          total: (acc.total += val.total),
        };
      },
      { completed: 0, total: 0 },
    );

    return result;
  }
}
