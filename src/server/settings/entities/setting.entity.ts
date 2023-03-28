import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Unique(['user'])
@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  max_tokens?: number;
  @Column()
  model: string;
  @Column('text', { array: true, nullable: true })
  stop?: string[];
  @Column()
  suffix?: string;
  @Column()
  temperature?: number;
  @Column({ nullable: true })
  translateTo?: string;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
