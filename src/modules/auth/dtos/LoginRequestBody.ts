import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestBody {
  @IsEmail({}, { message: 'Please inform a valid email.' })
  email: string;

  @IsNotEmpty({ message: 'Please inform your password.' })
  password: string;
}
