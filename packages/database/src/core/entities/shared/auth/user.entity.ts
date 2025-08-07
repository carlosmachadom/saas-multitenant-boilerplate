import { User } from '@workspace/auth-core';
import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { RoleEntity } from './role.entity';
import { SessionEntity } from './session.entity';

@Entity({ name: 'users' })
export class UserEntity implements User {
  @PrimaryColumn('uuid')
  id: string;

  @Column('varchar', { unique: true, length: 255 })
  email: string;

  @Column('varchar', { length: 255 })
  password!: string;

  @Column('boolean', { name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp with time zone', nullable: true })
  deletedAt: Date | null;

  // --- Relaciones ---

  @OneToOne(() => ProfileEntity, (profile: ProfileEntity) => profile.user)
  profile: ProfileEntity;

  @ManyToMany(() => RoleEntity)
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: RoleEntity[];

  @OneToMany(() => SessionEntity, (session: SessionEntity) => session.user)
  sessions: SessionEntity[];
}
