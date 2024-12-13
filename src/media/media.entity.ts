import { Diary } from 'src/diary/diary.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Media extends BaseEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ nullable: true })
  url: string;

  @ManyToOne(() => Diary, (diary) => diary.photos, { nullable: true })
  @JoinColumn({ name: 'diaryID' })
  diary: Diary;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
