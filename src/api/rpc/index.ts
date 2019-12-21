import { register, registerEx } from '../../rpc'
import { Device } from '../../db/device'

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
