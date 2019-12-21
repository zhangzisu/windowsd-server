import { createConnection } from 'typeorm'
import { User } from './user'
import { Device } from './device'
import { argv } from '../cli'

const connectOptions: any = {
  type: <never>argv.databaseType,
  entities: [User, Device],
  synchronize: true
}

if (argv.databaseUrl) {
  connectOptions.url = argv.databaseUrl
} else {
  connectOptions.database = argv.database
}

createConnection(connectOptions).then(() => {
  console.log('Database connected')
}).catch((err: any) => {
  console.error(err)
  process.exit(1)
})
