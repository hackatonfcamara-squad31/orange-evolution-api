import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, isNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserRequestDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, insira o seu nome.' })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Por favor, insira um email válido,' })
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  is_admin?: boolean;
}
