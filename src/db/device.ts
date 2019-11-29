import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { User } from './user'

@Entity()
export class Device extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => User, user => user.devices)
  user!: User
}
