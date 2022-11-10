import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateModuleRequestDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, informe o título do módulo.' })
  title: string;

  @ApiProperty()
  @IsNumber({}, { message: 'Por favor, informe a posição do módulo.' })
  order: number;
}
