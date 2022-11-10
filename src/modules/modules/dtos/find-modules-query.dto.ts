import { IsOptional } from "class-validator";

export class FindModulesQuery {
  @IsOptional()
  count?: number;
  
  @IsOptional()
  page?: number;
}
