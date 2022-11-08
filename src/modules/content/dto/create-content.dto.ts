import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateContentDTO {
  @IsNotEmpty({ message: 'Por favor, informe o ID do módulo' })
  module_id: number;

  @IsNotEmpty({ message: 'Por favor, informe o  título do conteúdo' })
  title: string;

  @IsNotEmpty({ message: 'Por favor, informe o  tipo do conteúdo' })
  type: string;

  @IsNotEmpty()
  creator_name: string;

  @IsNotEmpty({ message: 'Por favor, informe a duração do conteúdo' })
  @IsNumber(
    {},
    { message: 'Por favor, informe a duração do conteúdo em segundos' },
  )
  duration: number;

  @IsNotEmpty({ message: 'Por favor, informe o link do conteúdo' })
  link: string;
}
