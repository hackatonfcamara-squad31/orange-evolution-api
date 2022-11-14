import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Por favor, insira o seu nome.' })
  name: string;

  @IsEmail({}, { message: 'Por favor, insira um email válido,' })
  email: string;

  @IsNotEmpty({ message: 'Por favor, insira sua senha.' })
  password: string;

  @IsBoolean({ message: 'Por favor, insira o tipo da sua conta.' })
  is_admin: boolean;

  avatar?: string;
}
