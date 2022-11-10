import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginRequestDTO {
  @ApiProperty()
  @IsEmail({}, { message: 'Por favor, insira um email válido,' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, insira sua senha.' })
  password: string;
}
