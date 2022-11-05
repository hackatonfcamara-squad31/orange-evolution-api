import { PartialType } from '@nestjs/swagger';
import { CreateContentDTO } from './create-content.dto';

export class UpdateContentDTO extends PartialType(CreateContentDTO) {}
