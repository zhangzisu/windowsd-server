import { Entity, BaseEntity, OneToMany, PrimaryGeneratedColumn, Column } from 'typeorm'
import { Device } from './device'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true })
  name!: string

  @OneToMany(() => Device, device => device.user)
  devices!: Device[]
}
