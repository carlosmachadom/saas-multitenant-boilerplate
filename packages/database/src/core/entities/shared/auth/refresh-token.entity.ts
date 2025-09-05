import { RefreshToken } from "@workspace/contracts";
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  Index,
} from "typeorm";
import { SessionEntity } from "./session.entity";

@Entity({ name: "refresh_tokens" })
@Index(["sessionId", "revoked", "expiresAt"])
export class RefreshTokenEntity implements RefreshToken {
  @PrimaryColumn("uuid")
  id: string;

  @Column("uuid", { name: "session_id" })
  sessionId: string;

  @Column("varchar", { length: 500 })
  token: string;

  @Column({ name: "expires_at", type: "timestamp with time zone" })
  expiresAt: Date;

  @CreateDateColumn({ name: "created_at", type: "timestamp with time zone" })
  createdAt: Date;

  @Column("boolean", { default: false })
  revoked: boolean;

  // --- Relaciones ---

  @ManyToOne(() => SessionEntity, (session) => session.refreshTokens)
  @JoinColumn({ name: "session_id" })
  session: SessionEntity;
}
