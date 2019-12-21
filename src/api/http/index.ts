import { Router } from 'express'
import { json } from 'body-parser'
import { User } from '../../db/user'
import { $ } from './util'
import { Device } from '../../db/device'

export const apiRouter = Router()

apiRouter.use(json())

apiRouter.post('/register', $(async (req, res) => {
  const { name } = req.body
  if (typeof name !== 'string' || !name) throw new Error('Bad request: name')
  const user = new User()
  user.name = name
  await user.save()
  const device = new Device()
  device.id = user.id
  device.rpc = true
  device.admin = true
  device.user = user
  await device.save()
  res.json({ id: user.id })
}))

apiRouter.post('/finduser', $(async (req, res) => {
  const { name } = req.body
  if (typeof name !== 'string' || !name) throw new Error('Bad request: name')
  const user = await User.findOneOrFail({ name })
  res.json({ id: user.id })
}))
