import { createConnection } from 'typeorm'
import { User } from './user'
import { Device } from './device'
import { argv } from 'yargs'

const type = (argv.dbType || 'mysql') as 'mysql'
const database = (argv.db || 'test') as string
const username = (argv.dbUser || 'test') as string
const password = (argv.dbPass || 'password') as string

console.log('Database Type : ' + type)
console.log('Database      : ' + database)

createConnection({
  type,
  database,
  username,
  password,
  entities: [User, Device],
  synchronize: true
}).then(() => {
  console.log('Database connected')
}).catch((err: any) => {
  console.error(err)
  process.exit(1)
})
