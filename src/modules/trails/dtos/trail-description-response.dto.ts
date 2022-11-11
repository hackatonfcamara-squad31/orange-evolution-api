import { Trail } from '../entities/trail.entity';

export class TrailDescriptionResponseDTO {
  trail: Trail;
  total: number;
  completed: number;
}
