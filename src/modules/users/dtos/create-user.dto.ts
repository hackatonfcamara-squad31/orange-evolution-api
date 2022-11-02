import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'Please inform your name.' })
  name: string;

  @IsEmail({}, { message: 'Please inform a valid email.' })
  email: string;

  @IsNotEmpty({ message: 'Please inform your password.' })
  password: string;

  @IsBoolean({ message: 'Please inform your account type.' })
  is_admin: boolean;
}
