import { IsNumber, IsUUID } from 'class-validator';

export class ReorderContentDTO {
  @IsUUID()
  id: string;

  @IsNumber({}, { message: 'Por favor, informe a posição do módulo.' })
  order: number;
}
