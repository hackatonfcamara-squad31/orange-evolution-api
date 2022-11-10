import { Module } from 'src/modules/modules/entities/module.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('trails')
export class Trail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  icon_url: string;

  @OneToMany(() => Module, (module) => module.trail, {
    cascade: true,
  })
  @JoinColumn({ name: 'modules' })
  modules: Module[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
