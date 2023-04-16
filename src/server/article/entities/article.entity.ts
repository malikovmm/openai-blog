import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { User } from '../../auth/entities/user.entity';
import { ArticleBlock } from './article-block.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => ArticleBlock, (block) => block.article)
  blocks?: ArticleBlock[];

  @ManyToOne(() => User, (user) => user.articles, { nullable: true })
  author: User;

  @ManyToMany(() => Category, (category) => category.articles)
  @JoinTable()
  categories?: Category[];

  @Column('simple-json')
  meta: {
    created_by_ai?: boolean;
    model?: string;
    temperature?: number;
    max_tokens?: number;
  };

  @UpdateDateColumn({
    type: 'timestamp',
    default: null,
    nullable: true,
  })
  public publish_at?: Date;

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
