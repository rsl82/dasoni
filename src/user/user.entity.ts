import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  kakaoID: string;

  @Column()
  name: string;

  @Column()
  profileImage: string;

  @Column({ nullable: true })
  refreshToken: string;

}
