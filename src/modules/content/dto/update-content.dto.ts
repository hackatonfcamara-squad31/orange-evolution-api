import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateContentDTO {
  @ApiPropertyOptional()
  @IsOptional()
  module_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  creator_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional()
  @IsOptional()
  link?: string;
}
