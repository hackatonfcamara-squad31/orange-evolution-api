import { IsNotEmpty } from 'class-validator';

export class CreateTrailRequestDTO {
  @IsNotEmpty({ message: 'Por favor, informe o nome da trilha.' })
  title: string;
}
