import { Router } from 'express'
import { json } from 'body-parser'

export const apiRouter = Router()

apiRouter.use(json)
