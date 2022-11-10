import { IsNotEmpty } from 'class-validator';

export class CreateCompletedStatusDTO {
  @IsNotEmpty({ message: 'Por favor, informe o ID do usuário' })
  user_id: string;

  @IsNotEmpty({ message: 'Por favor, informe o ID do conteúdo' })
  content_id: string;
}
