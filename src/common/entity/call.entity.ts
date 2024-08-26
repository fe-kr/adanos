import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Relation,
} from 'typeorm';

import type { User } from './user.entity';

@Entity()
export class Call {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamptz',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  endedAt: Date | null;

  @ManyToOne('User', 'sentCalls')
  sender: Relation<User>;

  @ManyToOne('User', 'receivedCalls')
  receiver: Relation<User>;
}
