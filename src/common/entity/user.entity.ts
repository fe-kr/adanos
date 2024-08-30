import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  Relation,
  Unique,
  BeforeInsert,
} from 'typeorm';

import type { Call } from './call.entity';
import { nanoid } from 'nanoid';

@Unique(['email', 'peerId'])
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  peerId: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: true, select: false })
  inactive: boolean;

  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    select: false,
  })
  updatedAt: Date;

  @OneToMany('Call', 'sender')
  sentCalls: Relation<Call[]>;

  @OneToMany('Call', 'receiver')
  receivedCalls: Relation<Call[]>;

  @BeforeInsert()
  generatePeerId() {
    this.peerId = nanoid(6);
  }
}
