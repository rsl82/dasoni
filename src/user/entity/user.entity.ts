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
import { Notification } from 'src/notification/notification.entity';
import { FriendRequest } from 'src/friend/entity/friend-request.entity';
import { Friend } from 'src/friend/entity/friend.entity';


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

  @OneToMany(() => Diary, (diary) => diary.receiver, {
    nullable: true,
    lazy: true,
  })
  receivedDiary: Promise<Diary[]>;

  @OneToMany(() => Diary, (diary) => diary.sender, {
    nullable: true,
    lazy: true,
  })
  sentDiary: Promise<Diary[]>;

  @OneToMany(() => Notification, (notification) => notification.receiver, {
    nullable: true,
    lazy: true,
  })
  notifications: Promise<Notification[]>;

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender, {
    nullable: true,
    lazy: true,
  })
  sentRequests: Promise<FriendRequest[]>;

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver, {
    nullable: true,
    lazy: true,
  })
  receivedRequests: Promise<FriendRequest[]>;

  @OneToMany(() => Friend, (friend) => friend.user, {
    nullable: true,
    lazy: true,
  })
  friends: Promise<Friend[]>;

}
