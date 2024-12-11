import {
  BaseEntity,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class KakaoUser extends BaseEntity {
  @PrimaryColumn()
  kakaoID: string;

  @OneToOne(() => User, (user) => user.kakaoUser)
  @JoinColumn()
  user: User;
}
