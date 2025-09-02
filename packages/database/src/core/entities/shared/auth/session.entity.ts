import { Session } from '@workspace/contracts';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity({ name: 'sessions' })
export class SessionEntity implements Session {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'inet', name: 'ip_address', nullable: true })
  ipAddress: string | null;

  @Column({ type: 'text', name: 'user_agent', nullable: true })
  userAgent: string | null;

  @Column({ name: 'last_access_at', type: 'timestamp with time zone' })
  lastAccessAt: Date;

  @Column({ type: 'integer', name: 'session_duration_minutes' })
  sessionDurationMinutes: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  // --- Relaciones ---

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToOne(() => RefreshTokenEntity, (token: RefreshTokenEntity) => token.session)
  refreshToken: RefreshTokenEntity;
}
