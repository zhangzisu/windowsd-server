import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm'
import { User } from './user'

@Entity()
export class Device extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ default: false })
  allowRPC!: boolean

  @ManyToOne(() => User, user => user.devices)
  user!: User
}
