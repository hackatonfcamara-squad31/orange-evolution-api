import { IsNotEmpty } from 'class-validator';

export class CreateModuleDTO {
  @IsNotEmpty({ message: 'Please inform the module title.' })
  title: string;

  @IsNotEmpty({ message: 'Please inform the module position.' })
  order: number;

  @IsNotEmpty({ message: 'Por favor, informe a trilha a qual o módulo pertence.' })
  trail: string;
}
