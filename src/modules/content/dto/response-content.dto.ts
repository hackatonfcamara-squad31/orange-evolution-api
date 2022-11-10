import { Content } from '../entities/content.entity';

export class ResponseContentDTO extends Content {
  is_completed?: boolean = false;
}
