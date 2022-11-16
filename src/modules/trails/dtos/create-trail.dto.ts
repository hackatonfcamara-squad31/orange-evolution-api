import { IsNotEmpty } from 'class-validator';
import { CreateModuleDTO } from '../../../modules/modules/dtos/create-module.dto';

export class CreateTrailDTO {
  @IsNotEmpty({ message: 'Por favor, informe o nome da trilha.' })
  title: string;

  icon?: string;

  modules?: CreateModuleDTO[];
}
