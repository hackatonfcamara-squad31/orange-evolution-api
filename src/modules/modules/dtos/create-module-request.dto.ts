import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateModuleRequestDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Please inform the module title.' })
  title: string;
  
  @ApiProperty()
  @IsNotEmpty({ message: 'Please inform the module position.' })
  order: number;
}
