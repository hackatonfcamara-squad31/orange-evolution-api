import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class ReorderModulesDTO {
  @ApiProperty()
  @IsUUID()
  id: string;
  
  @ApiProperty()
  @IsNumber({}, { message: 'Por favor, informe a posição do módulo.' })
  order: number;
}
