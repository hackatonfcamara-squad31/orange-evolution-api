import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateModuleDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, informe o título do módulo.' })
  title: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, informe a posição do módulo' })
  order: number;

  @ApiProperty()
  icon?: string;
}
