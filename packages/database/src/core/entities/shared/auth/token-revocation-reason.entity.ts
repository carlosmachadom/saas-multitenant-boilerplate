import { TokenRevocationReason } from "@workspace/contracts";
import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { TokenBlacklistEntity } from "./token-blacklist.entity";

@Entity({ name: "token_revocation_reasons" })
export class TokenRevocationReasonEntity implements TokenRevocationReason {
  @PrimaryColumn("uuid")
  id: string;

  @Column("varchar", { unique: true, length: 50 })
  code: string;

  @Column("varchar", { length: 255 })
  label: string;

  @Column("boolean", { name: "internal_only", default: false })
  internalOnly: boolean;

  @OneToMany(
    () => TokenBlacklistEntity,
    (tokenBlackList: TokenBlacklistEntity) => tokenBlackList.reason
  )
  tokens: TokenBlacklistEntity[];
}
