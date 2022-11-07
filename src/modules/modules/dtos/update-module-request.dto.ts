import { IsNotEmpty } from "class-validator";

export class UpdateModuleRequestDTO {
  @IsNotEmpty({ message: 'Please inform the module title.' })
  title: string;
}