import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserRequestDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, insira o seu nome.' })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Por favor, insira um email válido,' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, insira sua senha.' })
  password: string;

  @ApiProperty()
  @IsBoolean({ message: 'Por favor, insira o tipo da sua conta.' })
  is_admin: boolean;
}
