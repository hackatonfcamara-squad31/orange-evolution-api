import { Completed } from '../../../modules/content-completed/entities/completed.entity';
import { Module } from '../../../modules/modules/entities/module.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('contents')
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Module, (module) => module.contents, {
    onDelete: 'CASCADE',
  })
  module: Module;

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

  @Column({ nullable: true, unique: false })
  order: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Completed, (completed) => completed.content, {
    cascade: true,
  })
  completed: Completed;
}
