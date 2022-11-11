import { Content } from 'src/modules/content/entities/content.entity';
import { Module } from '../entities/module.entity';

export class ModuleDescriptionResponseDTO {
  trail_id: string;
  trail_title: string;
  module: Module;
  contents: Content[];
  total: number;
  completed: number;
}
