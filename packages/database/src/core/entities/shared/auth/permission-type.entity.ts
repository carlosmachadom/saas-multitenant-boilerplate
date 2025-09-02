import { PermissionType } from "@workspace/contracts";
import { Column, Entity, PrimaryColumn, OneToMany } from "typeorm";
import { PermissionEntity } from "./permission.entity";

@Entity({ name: "permission_types" })
export class PermissionTypeEntity implements PermissionType {
  @PrimaryColumn("uuid")
  id: string;

  @Column("varchar", { unique: true, length: 100 })
  code: string;

  @Column("text", { nullable: true })
  description?: string;

  @OneToMany(() => PermissionEntity, (permission) => permission.type)
  permissions: PermissionEntity[];
}
