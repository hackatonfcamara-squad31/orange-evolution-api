import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  module_id: number;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column()
  creator_name: string;

  @Column()
  duration: number;

  @Column()
  link: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}
