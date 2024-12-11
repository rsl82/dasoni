import { timestamp } from 'rxjs';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { KakaoUser } from './kakao.entity';
import { Diary } from 'src/diary/diary.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, unique: true })
  name: string;

  @Column()
  profileImage: string;

  @Column({ nullable: true })
  refreshToken: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @OneToOne(() => KakaoUser, (kakaoUser) => kakaoUser.user, { nullable: true })
  kakaoUser: KakaoUser;

  @OneToMany(() => Diary, (diary) => diary.receiver, { nullable: true })
  receivedDiary: Diary[];

  @OneToMany(() => Diary, (diary) => diary.sender, { nullable: true })
  sentDiary: Diary[];
}
