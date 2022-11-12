import { ResponseContentDTO } from 'src/modules/content/dto/response-content.dto';
import { Module } from '../entities/module.entity';

export class ModuleDescriptionResponseDTO {
  trail_id: string;
  trail_title: string;
  module: Module;
  contents: ResponseContentDTO[];
  total: number;
  completed: number;
}
