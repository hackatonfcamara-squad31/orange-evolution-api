import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateModuleRequestDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Please inform the module title.' })
  title: string;
}
