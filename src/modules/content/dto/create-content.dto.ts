import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateContentDTO {
  @IsNotEmpty({ message: "Please inform modedule's ID" })
  module_id: number;

  @IsNotEmpty({ message: "Please inform content's title" })
  title: string;

  @IsNotEmpty({ message: "Please inform content's type" })
  type: string;

  @IsNotEmpty()
  creator_name: string;

  @IsNotEmpty({ message: "Please inform content's duration" })
  @IsNumber(
    {},
    { message: "Please inform a correctly content's duration in seconds" },
  )
  duration: number;

  @IsNotEmpty({ message: "Please inform content's link" })
  link: string;
}
