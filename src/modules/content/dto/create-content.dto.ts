import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContentDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, informe o ID do módulo' })
  @IsUUID()
  module_id: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, informe o  título do conteúdo' })
  title: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, informe o  tipo do conteúdo' })
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  creator_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, informe a duração do conteúdo' })
  @IsNumber(
    {},
    { message: 'Por favor, informe a duração do conteúdo em segundos' },
  )
  duration: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, informe a posição do conteúdo' })
  order: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, informe o link do conteúdo' })
  link: string;
}
