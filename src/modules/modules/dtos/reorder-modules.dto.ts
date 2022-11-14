import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class ReorderModulesDTO {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsNumber({}, { message: 'Por favor, informe a posição do módulo.' })
  order: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, informe a trilha do módulo.' })
  trail_id: string;
}
