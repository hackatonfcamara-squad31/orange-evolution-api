import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateTrailDTO {
  @IsUUID()
  id: string;

  @IsNotEmpty({ message: 'Por favor, informe o nome da trilha.' })
  title: string;
}
