import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class ReorderModulesDTO {
  @ApiProperty()
  @IsUUID()
  id: string;
  
  @ApiProperty()
  @IsNumber({}, { message: 'Please inform the module position.' })
  order: number;
}
