import { RefreshToken } from '@workspace/auth-core';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { SessionEntity } from './session.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshTokenEntity implements RefreshToken {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid', { name: 'session_id' })
  sessionId: string;

  @Column('varchar', { length: 500 })
  token: string;

  @Column({ name: 'expires_at', type: 'timestamp with time zone' })
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column('boolean', { default: false })
  revoked: boolean;

  // --- Relaciones ---

  @OneToOne(() => SessionEntity, (session) => session.refreshToken)
  @JoinColumn({ name: 'session_id' })
  session: SessionEntity;
}
