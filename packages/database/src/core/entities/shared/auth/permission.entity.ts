import { Permission } from "@workspace/contracts";
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { PermissionTypeEntity } from "./permission-type.entity";

@Entity({ name: "permissions" })
export class PermissionEntity implements Permission {
  @PrimaryColumn("uuid")
  id: string;

  @Column("varchar", { unique: true, length: 100 })
  code: string;

  @Column("text", { nullable: true })
  description?: string;

  @ManyToOne(() => PermissionTypeEntity, (type) => type.permissions)
  @JoinColumn({ name: "permission_type_id" })
  type: PermissionTypeEntity;
}
