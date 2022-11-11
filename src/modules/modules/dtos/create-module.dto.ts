import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateModuleDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, informe o título do módulo.' })
  title: string;

  @ApiProperty()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, informe a posição do módulo' })
  order: number;

  @IsNotEmpty({
    message: 'Por favor, informe a trilha a qual o módulo pertence.',
  })
  trail: string;
}
