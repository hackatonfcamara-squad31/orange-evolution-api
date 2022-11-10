import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateModuleRequestDTO {
  @IsNotEmpty({ message: 'Please inform the module title.' })
  title: string;
  
  @IsOptional()
  description?: string;

  @IsNotEmpty({ message: 'Please inform the module position.' })
  order: number;

  @IsNotEmpty({ message: 'Por favor, informe a trilha a qual o módulo pertence.' })
  trail: string;
}
