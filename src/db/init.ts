import { createConnection } from 'typeorm'
import { User } from './user'
import { Device } from './device'

createConnection({
  type: 'mysql',
  database: 'test',
  username: 'test',
  password: 'password',
  entities: [User, Device],
  synchronize: true
}).then(() => {
  console.log('Database connected')
}).catch((err: any) => {
  console.error(err)
  process.exit(1)
})
