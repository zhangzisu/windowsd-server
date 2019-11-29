import { Entity, BaseEntity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Device } from './device'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @OneToMany(() => Device, device => device.user)
  devices!: Device[]
}
