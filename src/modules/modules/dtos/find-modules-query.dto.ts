import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class FindModulesQuery {
  @ApiProperty()
  @IsOptional()
  count?: number;
  
  @ApiProperty()
  @IsOptional()
  page?: number;
}
