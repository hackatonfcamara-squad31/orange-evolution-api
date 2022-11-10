import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import upload from '../../config/upload';
import StorageProvider from '../storage/storage-provider-model';
import { CreateTrailDTO } from './dtos/create-trail.dto';
import { UpdateTrailDTO } from './dtos/update-trail.dto';
import { Trail } from './entities/trail.entity';

@Injectable()
export class TrailsService {
  constructor(
    @Inject('TRAIL_REPOSITORY')
    private trailsRepository: Repository<Trail>,

    @Inject('StorageProvider')
    private storageProvider: StorageProvider,
  ) {}

  async create({ title, icon }: CreateTrailDTO): Promise<Trail> {
    const imageUrl = await this.storageProvider.saveFile(icon);

    const module = this.trailsRepository.create({
      title,
      icon_url: imageUrl,
    });

    return await this.trailsRepository.save(module);
  }

  async update({ id, title }: UpdateTrailDTO): Promise<Trail> {
    const module = await this.trailsRepository.findOne({ where: { id } });

    if (!module) throw new NotFoundException('Trilha não encontrada.');

    await this.trailsRepository.update(
      { id: module.id },
      {
        ...module,
        title,
      },
    );

    return {
      ...module,
      title,
    };
  }

  async updateIcon(id: string, icon: string): Promise<Trail> {
    if (icon === '')
      throw new BadRequestException('Conteúdo enviado não é uma imagem.');

    const module = await this.trailsRepository.findOne({ where: { id } });

    if (!module) {
      if (upload.driver === 'disk') await this.storageProvider.deleteFile(icon);
      throw new NotFoundException('Trilha não encontrada.');
    }

    await this.storageProvider.deleteFile(module.icon_url);

    const imageUrl = await this.storageProvider.saveFile(icon);

    await this.trailsRepository.update(
      { id },
      {
        icon_url: imageUrl,
      },
    );

    return {
      ...module,
      icon_url: imageUrl,
    };
  }

  async findById(id: string): Promise<Trail> {
    const module = await this.trailsRepository.findOne({ where: { id } });

    if (!module) throw new NotFoundException('Trilha não encontrada.');

    return module;
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
}
