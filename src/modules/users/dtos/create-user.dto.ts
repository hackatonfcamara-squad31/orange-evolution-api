import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Por favor, informe seu nome.' })
  name: string;

  @IsEmail({}, { message: 'Por favor, informe um email válido.' })
  email: string;

  @IsNotEmpty({ message: 'Por favor, informe sua senha.' })
  password: string;

  @IsBoolean({ message: 'Por favor, informe o tipo da conta.' })
  is_admin: boolean;
}
