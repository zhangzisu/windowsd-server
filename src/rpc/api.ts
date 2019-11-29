import { Device } from '../db/device'

export async function RPCListDevices (deviceID: string) {
  const device = await Device.findOne(deviceID, { relations: ['user', 'user.devices'] })
  if (!device) throw new Error('No such device')
  return device.user.devices
}
