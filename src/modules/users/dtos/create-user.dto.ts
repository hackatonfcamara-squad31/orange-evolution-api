import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Please inform your name.' })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Please inform a valid email.' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Please inform your password.' })
  password: string;

  @ApiProperty()
  @IsBoolean({ message: 'Please inform your account type.' })
  is_admin: boolean;
}
