import { Entity, BaseEntity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm'
import { User } from './user'

@Entity()
export class Device extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ nullable: true, select: false })
  token?: string

  @Column({ default: false })
  rpc!: boolean

  @Column({ default: false })
  admin!:boolean

  @ManyToOne(() => User, user => user.devices)
  user!: User
}
