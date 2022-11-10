import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginRequestDTO {
  @ApiProperty()
  @IsEmail({}, { message: 'Please inform a valid email.' })
  email: string;
  
  @ApiProperty()
  @IsNotEmpty({ message: 'Please inform your password.' })
  password: string;
}
