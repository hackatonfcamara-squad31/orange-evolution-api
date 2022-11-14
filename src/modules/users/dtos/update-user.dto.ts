import { IsUUID } from 'class-validator';

export class UpdateUserDTO {
  @IsUUID()
  id: string;

  name?: string;

  email?: string;

  password?: string;

  is_admin?: boolean;
}
