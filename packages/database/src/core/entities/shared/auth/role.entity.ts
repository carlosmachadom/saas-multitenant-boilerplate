import { Role } from '@workspace/auth-core';
import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { PermissionEntity } from './permission.entity';

@Entity({ name: 'roles' })
export class RoleEntity implements Role {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', { unique: true, length: 100 })
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  // --- Relaciones ---

  @ManyToMany(() => PermissionEntity)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: PermissionEntity[];
}
