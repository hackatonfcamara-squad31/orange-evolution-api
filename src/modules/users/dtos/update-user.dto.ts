import { IsEmail, IsNotEmpty, isNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateUserDTO {
  @IsUUID()
  id: string;

  @IsNotEmpty({ message: 'Por favor, insira o seu nome.' })
  name: string;

  @IsEmail({}, { message: 'Por favor, insira um email válido,' })
  email: string;

  password?: string;

  is_admin?: boolean;
}
