import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.articles)
  author: User;

  @ManyToMany(() => Category, (category) => category.articles)
  @JoinTable()
  categories?: Category[];

  @Column('simple-json')
  meta: {
    model: string;
    prompt: string;
    temperature: number;
    max_tokens?: number;
    top_p?: number;
    best_of?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
  };

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at?: Date;
}
