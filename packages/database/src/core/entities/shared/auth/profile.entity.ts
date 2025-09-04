import { Profile } from '@workspace/contracts';
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'user_profiles' })
export class ProfileEntity implements Profile {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column('varchar', { name: 'full_name', nullable: true, length: 255 })
  fullName?: string;

  // --- Relaciones ---

  @OneToOne(() => UserEntity, (user) => user.profile)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
