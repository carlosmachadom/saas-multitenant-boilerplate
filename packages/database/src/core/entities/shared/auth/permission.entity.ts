import { Permission } from '@workspace/auth-core';
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'permissions' })
export class PermissionEntity implements Permission {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', { unique: true, length: 100 })
  code: string;

  @Column('text', { nullable: true })
  description?: string;
}
