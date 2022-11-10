import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateModuleDTO {
  @IsUUID()
  id: string;

  @IsNotEmpty({ message: 'Please inform the module title.' })
  title: string;

  description?: string;
}
