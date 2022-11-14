import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FindModulesQuery {
  @ApiPropertyOptional()
  @IsOptional()
  count?: number;

  @ApiPropertyOptional()
  @IsOptional()
  page?: number;
}
