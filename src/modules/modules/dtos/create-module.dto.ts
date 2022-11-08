import { IsNotEmpty } from 'class-validator';

export class CreateModuleDTO {
  @IsNotEmpty({ message: 'Please inform the module title.' })
  title: string;

  @IsNotEmpty({ message: 'Please inform the module position.' })
  order: number;

  icon?: string;
}
