import { IsNotEmpty } from 'class-validator';

export class UpdateTrailRequestDTO {
  @IsNotEmpty({ message: 'Por favor, informe o nome da trilha.' })
  title: string;
}
