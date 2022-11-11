import { Content } from 'src/modules/content/entities/content.entity';
import { Module } from '../entities/module.entity';

export class ModuleDescriptionResponseDTO {
  module: Module;
  contents: Content[];
  total: number;
  completed: number;
}
