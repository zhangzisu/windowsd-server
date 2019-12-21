import express, { static as S } from 'express'
import { createServer as createInsecure } from 'http'
import { createServer as createSecure } from 'https'
import { readFileSync } from 'fs'
import { argv } from '../cli'
import { apiRouter } from '../api/http'
import { join } from 'path'

const app = express()

app.use(S(join(__dirname, '..', '..', 'frontend', 'dist')))

app.use('/api', apiRouter)

function createServer () {
  if (argv.https) {
    const options = {
      key: readFileSync(argv.key!),
      cert: readFileSync(argv.cert!)
    }
    return createSecure(options, app)
  } else {
    return createInsecure(app)
  }
}

export const server = createServer()
