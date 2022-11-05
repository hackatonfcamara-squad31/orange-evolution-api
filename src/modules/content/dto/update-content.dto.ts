import { PartialType } from '@nestjs/mapped-types';
import { CreateContentDTO } from './create-content.dto';

export class UpdateContentDTO extends PartialType(CreateContentDTO) {}
