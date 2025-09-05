import { AuditAction } from "@workspace/contracts";
import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { AuditLogEntity } from "./audit-log.entity";

@Entity({ name: "audit_actions" })
export class AuditActionEntity implements AuditAction {
  @PrimaryColumn("uuid")
  id: string;

  @Column("varchar", { unique: true, length: 100 })
  name: string;

  @Column("varchar", { nullable: true })
  description: string;

  @OneToMany(() => AuditLogEntity, (auditLog) => auditLog.action)
  auditLogs: AuditLogEntity[]
}
