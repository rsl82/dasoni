import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn()
  kakaoID: string;

  @Column()
  name: string;

  @Column()
  profile_image: string;
}
