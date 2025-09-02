import { TokenBlacklist } from '@workspace/contracts';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RefreshTokenEntity } from './refresh-token.entity';
import { TokenRevocationReasonEntity } from './token-revocation-reason.entity';

@Entity({ name: 'token_blacklist' })
export class TokenBlacklistEntity implements TokenBlacklist {
  @PrimaryColumn('uuid')
  id: string;

  @Column('uuid', { name: 'refresh_token_id' })
  refreshTokenId: string;

  @Column('uuid', { name: 'reason_id' })
  reasonId: string;

  @CreateDateColumn({ name: 'blacklisted_at', type: 'timestamp with time zone' })
  blacklistedAt: Date;

  // --- Relaciones ---

  @ManyToOne(() => RefreshTokenEntity)
  @JoinColumn({ name: 'refresh_token_id' })
  refreshToken: RefreshTokenEntity;

  @ManyToOne(() => TokenRevocationReasonEntity)
  @JoinColumn({ name: 'reason_id' })
  reason: TokenRevocationReasonEntity;
}
