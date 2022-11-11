import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateTrailRequestDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, informe o nome da trilha.' })
  title: string;
}
