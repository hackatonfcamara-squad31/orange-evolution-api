import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateModuleRequestDTO } from 'src/modules/modules/dtos/create-module-request.dto';

export class CreateTrailRequestDTO {
  @IsNotEmpty({ message: 'Por favor, informe o nome da trilha.' })
  title: string;

  @IsOptional()
  modules?: CreateModuleRequestDTO[];
}
