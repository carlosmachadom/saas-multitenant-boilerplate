import { AuditResource } from "@workspace/contracts";
import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { AuditLogEntity } from "./audit-log.entity";
import { PermissionEntity } from "../auth";

@Entity({ name: "audit_resources" })
export class AuditResourceEntity implements AuditResource {
  @PrimaryColumn("uuid")
  id: string;

  @Column("varchar", { unique: true, length: 100 })
  name: string;

  @Column("varchar", { nullable: true })
  description: string;

  @OneToMany(() => AuditLogEntity, (auditLog) => auditLog.resource)
  auditLogs: AuditLogEntity[];

  @OneToMany(() => PermissionEntity, (permission) => permission.auditResource)
  permissions?: PermissionEntity[];
}
