import { Module } from '../entities/module.entity';

export class ModuleDescriptionResponseDTO {
  module: Module;
  content_count: number;
  content_completed_count: number;
}
