import { IsNumber, IsUUID } from "class-validator";

export class ReorderModulesDTO {
  @IsUUID()
  id: string;

  @IsNumber({}, { message: 'Please inform the module position.' })
  order: number;
}