import { register, registerEx } from '../../rpc'
import { Device } from '../../db/device'
import { disconnect } from '../../io'

register('list_devices', async function (_args: any, { s }) {
  const device = await Device.findOne(s, { relations: ['user', 'user.devices'] })
  if (!device) throw new Error('No such device')
  return device.user.devices
})

registerEx('add_device', async function ({ s }, admin?: boolean, rpc?: boolean) {
  const source = await Device.findOneOrFail(s, { relations: ['user'] })
  if (!source.admin) throw new Error('Access denied')
  admin = admin || false
  if (typeof admin !== 'boolean') throw new Error('Bad Arg')
  rpc = rpc || false
  if (typeof rpc !== 'boolean') throw new Error('Bad Arg')
  const device = new Device()
  device.admin = admin
  device.rpc = rpc
  device.user = source.user
  await device.save()
  return device.id
})

registerEx('remove_device', async function ({ s }, device: string) {
  if (!device || typeof device !== 'string') throw new Error('Invalid operation')
  const source = await Device.findOneOrFail(s, { relations: ['user'] })
  if (!source.admin) throw new Error('Access denied')
  if (source.user.id === device) throw new Error('Invalid operation')
  const target = await Device.findOneOrFail(device)
  disconnect(device)
  await target.remove()
})

registerEx('revoke_device', async function ({ s }, device: string) {
  if (!device || typeof device !== 'string') throw new Error('Invalid operation')
  const source = await Device.findOneOrFail(s)
  if (!source.admin) throw new Error('Access denied')
  const target = await Device.findOneOrFail(device)
  target.token = ''
  await target.save()
})
