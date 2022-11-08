import { Content } from 'src/modules/content/entities/content.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Completed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @OneToOne(() => Content, (content) => content.completed)
  @JoinColumn({ name: 'content_id' })
  content: Content;
}
