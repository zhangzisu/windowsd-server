import { createConnection } from 'typeorm'
import { User } from './user'
import { Device } from './device'
import { argv } from '../cli'

console.log('Database Type : ' + argv.databaseType)
console.log('Database      : ' + argv.databaseUrl)

createConnection({
  type: <any>argv.databaseType,
  url: argv.databaseUrl,
  entities: [User, Device],
  synchronize: true
}).then(() => {
  console.log('Database connected')
}).catch((err: any) => {
  console.error(err)
  process.exit(1)
})
