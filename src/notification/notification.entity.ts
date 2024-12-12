import { NotiType } from 'src/util/enum/type.enum';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  receiverID: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  type: NotiType;

  @Column('uuid')
  relatedID: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  readAt: Date | null;
}
