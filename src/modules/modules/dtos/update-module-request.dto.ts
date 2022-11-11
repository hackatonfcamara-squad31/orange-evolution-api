import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateModuleRequestDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, informe o título do módulo.' })
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  description?: string;
}
