import { Content } from 'src/modules/content/entities/content.entity';
import { Trail } from 'src/modules/trails/entities/trail.entity';
import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';

@Entity('modules')
export class Module {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true, unique: false })
  order: number;

  @ManyToOne(() => Trail, (trail) => trail.modules, {
    onDelete: 'CASCADE'
  })
  trail: Trail;

  @OneToMany(() => Content, (content) => content.module, {
    cascade: true,
  })
  @JoinColumn({ name: 'contents' })
  contents: Content[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
