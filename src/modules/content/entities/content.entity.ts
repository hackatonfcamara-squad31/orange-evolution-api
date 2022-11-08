import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'module_id' })
  moduleId: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 100 })
  type: string;

  @Column({ length: 255 })
  creator_name: string;

  @Column()
  duration: number;

  @Column({ length: 1000 })
  link: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}