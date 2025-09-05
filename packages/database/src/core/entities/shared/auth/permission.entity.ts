import { Permission } from "@workspace/contracts";
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  OneToOne,
} from "typeorm";
import { PermissionTypeEntity } from "./permission-type.entity";
import { RoleEntity } from "./role.entity";
import { AuditResourceEntity } from "../audit";

@Entity({ name: "permissions" })
export class PermissionEntity implements Permission {
  @PrimaryColumn("uuid")
  id: string;

  @Column("varchar", { unique: true, length: 100 })
  code: string;

  @Column("text", { nullable: true })
  description?: string;

  @Column("uuid", { name: "permission_type_id" })
  permissionTypeId: string;

  @Column("uuid", { name: "audit_resource_id", nullable: true })
  auditResourceId?: string;

  @ManyToOne(() => PermissionTypeEntity, (type) => type.permissions)
  @JoinColumn({ name: "permission_type_id" })
  type: PermissionTypeEntity;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];

  @ManyToOne(() => AuditResourceEntity, { nullable: true })
  @JoinColumn({ name: "audit_resource_id" })
  auditResource?: AuditResourceEntity;
}
