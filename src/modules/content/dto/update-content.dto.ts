import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateContentDTO {
  @ApiProperty()
  @IsOptional()
  module_id?: string;

  @ApiProperty()
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsOptional()
  type?: string;

  @ApiProperty()
  @IsOptional()
  creator_name?: string;

  @ApiProperty()
  @IsOptional()
  duration?: number;

  @ApiProperty()
  @IsOptional()
  link?: string;
}
