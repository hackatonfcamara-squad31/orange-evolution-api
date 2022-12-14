import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import upload from '../../config/upload';
import { ModulesService } from '../modules/module.service';
import StorageProvider from '../storage/storage-provider-model';
import { User } from '../users/entities/user.entity';
import { CreateTrailDTO } from './dtos/create-trail.dto';
import { TrailDescriptionResponseDTO } from './dtos/trail-description-response.dto';
import { TrailsDescriptionResponseDTO } from './dtos/trails-description-response';
import { UpdateTrailDTO } from './dtos/update-trail.dto';
import { Trail } from './entities/trail.entity';

@Injectable()
export class TrailsService {
  constructor(
    @Inject('TRAIL_REPOSITORY')
    private trailsRepository: Repository<Trail>,

    @Inject(forwardRef(() => ModulesService))
    private modulesService: ModulesService,

    @Inject('StorageProvider')
    private storageProvider: StorageProvider,
  ) {}

  async create({ title, icon, modules }: CreateTrailDTO): Promise<Trail> {
    const imageUrl = await this.storageProvider.saveFile(icon);

    const createdTrail = this.trailsRepository.create({
      title,
      icon_url: imageUrl,
    });

    const trail = await this.trailsRepository.save(createdTrail);

    if (modules?.length > 0) {
      const modulePromises = modules.map(async (module) => {
        await this.modulesService.create({ ...module, trail: trail.id });
      });

      await Promise.all(modulePromises);
    }

    return trail;
  }

  async update({ id, title }: UpdateTrailDTO): Promise<Trail> {
    const trail = await this.trailsRepository.findOne({ where: { id } });

    if (!trail) throw new NotFoundException('Trilha não encontrada.');

    await this.trailsRepository.update(
      { id: trail.id },
      {
        ...trail,
        title,
      },
    );

    return {
      ...trail,
      title,
    };
  }

  async updateIcon(id: string, icon: string): Promise<Trail> {
    if (icon === '')
      throw new BadRequestException('Conteúdo enviado não é uma imagem.');

    const trail = await this.trailsRepository.findOne({ where: { id } });

    if (!trail) {
      if (upload.driver === 'disk') await this.storageProvider.deleteFile(icon);
      throw new NotFoundException('Trilha não encontrada.');
    }

    await this.storageProvider.deleteFile(trail.icon_url);

    const imageUrl = await this.storageProvider.saveFile(icon);

    await this.trailsRepository.update(
      { id },
      {
        icon_url: imageUrl,
      },
    );

    return {
      ...trail,
      icon_url: imageUrl,
    };
  }

  async findById(id: string): Promise<Trail> {
    const trail = await this.trailsRepository.findOne({
      where: { id },
      relations: ['modules'],
    });

    if (!trail) throw new NotFoundException('Trilha não encontrada.');

    return trail;
  }

  async find(): Promise<Trail[]> {
    const trails = await this.trailsRepository.find({
      order: { updated_at: 'DESC' },
    });

    return trails;
  }

  async delete(id: string): Promise<void> {
    const deletedModule = await this.trailsRepository.findOne({
      where: { id },
    });

    if (!deletedModule) throw new NotFoundException('Trilha não encontrada.');

    await this.storageProvider.deleteFile(deletedModule.icon_url);

    await this.trailsRepository.delete(id);
  }

  async description(
    id: string,
    user: User,
  ): Promise<TrailDescriptionResponseDTO> {
    const trail = await this.findById(id);

    const { total, completed } = await this.modulesService.count(id, user);

    const descriptionResponse: TrailDescriptionResponseDTO = {
      trail,
      total,
      completed,
    };
    return descriptionResponse;
  }

  async findTrailsDescription(
    user: User,
  ): Promise<TrailsDescriptionResponseDTO> {
    const trails: Trail[] = await this.find();

    const countPromises = trails.map(async (trail, index) => {
      const count = await this.modulesService.count(trail.id, user);
      trails[index] = { ...trail, ...count };
    });

    await Promise.all(countPromises);

    const description: TrailsDescriptionResponseDTO = {
      trails,
    };

    return description;
  }

  async findByModuleId(id: string): Promise<Trail> {
    const trail: Trail = await this.trailsRepository.findOne({
      where: { modules: { id } },
    });

    if (!trail) {
      throw new NotFoundException('Trilha não encontrada.');
    }

    return trail;
  }
}
