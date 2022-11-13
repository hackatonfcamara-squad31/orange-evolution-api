import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCompletedStatusDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, informe o ID do usuário' })
  user_id: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Por favor, informe o ID do conteúdo' })
  content_id: string;
}
