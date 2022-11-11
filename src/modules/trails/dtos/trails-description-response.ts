import { Trail } from '../entities/trail.entity';

export class TrailsDescriptionResponseDTO {
  trails: Trail[];
  total: number;
  completed: number;
}
