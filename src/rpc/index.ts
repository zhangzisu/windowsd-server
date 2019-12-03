import { Device } from '../db/device'
import { register } from './host'

register('list_devices', async function (_args: any, { deviceID }) {
  const device = await Device.findOne(deviceID, { relations: ['user', 'user.devices'] })
  if (!device) throw new Error('No such device')
  return device.user.devices
})
