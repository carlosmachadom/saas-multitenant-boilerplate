import { RoleType } from "@workspace/contracts";
import { Column, Entity, PrimaryColumn, OneToMany } from "typeorm";
import { RoleEntity } from "./role.entity";

@Entity({ name: "role_types" })
export class RoleTypeEntity implements RoleType {
  @PrimaryColumn("uuid")
  id: string;

  @Column("varchar", { unique: true, length: 100 })
  code: string;

  @Column("text", { nullable: true })
  description?: string;

  @OneToMany(() => RoleEntity, (role) => role.type)
  roles: RoleEntity[];
}
