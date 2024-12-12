import { Media } from 'src/media/media.entity';
import { User } from 'src/user/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Diary extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  message: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ nullable: true })
  location: string;

  @ManyToOne(() => User, (user) => user.receivedDiary)
  @JoinColumn({ name: 'receiverID' })
  receiver: User;

  @ManyToOne(() => User, (user) => user.sentDiary)
  @JoinColumn({ name: 'senderID' })
  sender: User;

  @OneToMany(() => Media, (media) => media.diary, {
    nullable: true,
    lazy: true,
  })
  photos: Promise<Media[]>;

  @Column({ default: false })
  isDeleted: boolean;
}
