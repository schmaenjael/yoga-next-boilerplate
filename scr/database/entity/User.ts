import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

export type UserRoleType = 'admin' | 'user';

@Entity({ name: 'users' })
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

  @Column('text', { name: 'profile_picture_path' })
  profilePicturePath: string;

  @Column('varchar', { length: 255, name: 'first_name' })
  firstName: string;

  @Column('varchar', { length: 255, name: 'last_name' })
  lastName: string;
}
