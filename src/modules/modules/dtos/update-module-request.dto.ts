import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateModuleRequestDTO {
  @IsNotEmpty({ message: 'Please inform the module title.' })
  title: string;

  @IsOptional()
  description?: string;
}
