import { ApiProperty } from "@nestjs/swagger";

export class FindModulesQuery {
  @ApiProperty()
  count?: number;
  
  @ApiProperty()
  page?: number;
}
