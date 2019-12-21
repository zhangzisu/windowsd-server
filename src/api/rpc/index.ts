import { register } from '../../rpc'
import { Device } from '../../db/device'

register('list_devices', async function (_args: any, { s }) {
  const device = await Device.findOne(s, { relations: ['user', 'user.devices'] })
  if (!device) throw new Error('No such device')
  return device.user.devices
})
