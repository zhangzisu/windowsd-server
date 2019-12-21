import 'reflect-metadata'
import './db'
import './io'
import './rpc'
import './api'

import { server } from './http'
import { argv } from './cli'

server.listen(argv.port, '::', () => {
  console.log('Server started at ' + argv.port)
})
