import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateModuleRequestDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, informe o título do módulo.' })
  title: string;
}
