import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BaseEntity,
} from 'typeorm';

export type UserRoleType = 'admin' | 'user';

@Entity('users')
@Unique(['id', 'email', 'userName'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column('varchar', { length: 255 })
  email: string;

  @Column('varchar', { length: 255, name: 'user_name' })
  userName: string;

  @Column('text') password: string;

  @Column('boolean', { default: false })
  confirmed: boolean;

  @Column('boolean', { default: false })
  locked: boolean;

  @Column({
    type: 'enum',
    enum: ['user', 'admin'],
    default: 'user',
  })
  role: UserRoleType;

  @Column('text', { default: '', name: 'profile_picture_path' })
  profilePicturePath: string;

  @Column('varchar', { default: '', length: 255, name: 'first_name' })
  firstName: string;

  @Column('varchar', { default: '', length: 255, name: 'last_name' })
  lastName: string;
}
