import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateModuleRequestDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, informe o título do módulo.' })
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber({}, { message: 'Por favor, informe a posição do módulo.' })
  order: number;

  @IsNotEmpty({
    message: 'Por favor, informe a trilha a qual o módulo pertence.',
  })
  trail: string;
}
