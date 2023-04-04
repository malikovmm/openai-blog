import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Article } from './article.entity';

@Entity()
export class ArticleBlock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
  @Column()
  content: string;
  @Column()
  order: number;
  @Column({ nullable: true })
  picture: string;
  @Column({ nullable: true })
  pictureLocation: number; // 0 - full width; 1 - left; 2 - right

  @ManyToOne(() => Article, (article) => article.blocks)
  article: Article;

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
