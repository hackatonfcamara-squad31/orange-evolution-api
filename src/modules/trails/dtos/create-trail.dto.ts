import { IsNotEmpty } from 'class-validator';

export class CreateTrailDTO {
  @IsNotEmpty({ message: 'Por favor, informe o nome da trilha.' })
  title: string;

  icon?: string;
}
