import { Role } from "@workspace/contracts";
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";
import { PermissionEntity } from "./permission.entity";
import { UserEntity } from "./user.entity";
import { RoleTypeEntity } from "./role-type.entity";

@Entity({ name: "roles" })
export class RoleEntity implements Role {
  @PrimaryColumn("uuid")
  id: string;

  @Column("varchar", { unique: true, length: 100 })
  name: string;

  @Column("text", { nullable: true })
  description?: string;

  @Column("uuid", { name: "roleTypeId" })
  roleTypeId: string;

  // --- Relaciones ---

  @ManyToMany(() => PermissionEntity)
  @JoinTable({
    name: "role_permissions",
    joinColumn: { name: "role_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" },
  })
  permissions: PermissionEntity[];

  @ManyToMany(() => UserEntity, (user: UserEntity) => user.roles)
  users: UserEntity[];

  @ManyToOne(() => RoleTypeEntity, (roleType) => roleType.roles)
  type: RoleTypeEntity;
}
