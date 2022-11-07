import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginRequestBody {
  @IsEmail({}, { message: 'Por favor, informe um email válido.' })
  email: string;

  @IsNotEmpty({ message: 'Por favor, informe sua senha.' })
  password: string;
}
