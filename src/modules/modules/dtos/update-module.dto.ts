import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateModuleDTO {
  @IsUUID()
  id: string;

  @IsNotEmpty({ message: 'Por favor, informe o título do módulo.' })
  title: string;
}
