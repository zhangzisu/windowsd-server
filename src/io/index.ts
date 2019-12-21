import socketIO, { Socket } from 'socket.io'
import { Device } from '../db/device'
import { server } from '../http'
import { handle, RPCCallback } from '../rpc'

export const io = socketIO(server)
const idMap = new Map<string, Socket>()

interface SocketMeta {
  deviceID: string
  userID: string
  attachedCbs: Set<RPCCallback>
}

const metaMap = new WeakMap<Socket, SocketMeta>()

io.use(async (socket, cb) => {
  try {
    const deviceID = socket.handshake.query.deviceID
    const token = socket.handshake.query.token
    if (typeof deviceID !== 'string' || typeof token !== 'string') {
      throw new Error('Bad Device')
    }
    const device = await Device.findOneOrFail(deviceID, { relations: ['user'], select: ['id', 'token'] })
    if (device.token) {
      if (device.token !== token) throw new Error('Bad Device')
    } else {
      device.token = token
      await device.save()
    }
    if (idMap.has(deviceID)) {
      const old = idMap.get(deviceID)!
      old.error(new Error('Bad Device'))
    }
    idMap.set(deviceID, socket)
    metaMap.set(socket, { deviceID, userID: device.user.id, attachedCbs: new Set() })
    cb()
  } catch (e) {
    cb(e)
  }
})

io.on('connection', (socket) => {
  const { userID, deviceID } = metaMap.get(socket)!
  socket.join(userID)
  socket.to(userID).emit('system', { deviceID, event: 'online' })
  socket.on('disconnect', () => {
    socket.to(userID).emit('system', { deviceID, event: 'offline' })
    const cbs = metaMap.get(socket)!.attachedCbs
    for (const cb of cbs) {
      cb(new Error('Client offline'), null)
    }
    idMap.delete(deviceID)
  })
  socket.on('rpc', (msg) => {
    handle(deviceID, msg)
      .catch((e: any) => {
        console.log(e)
      })
  })
})

export function getAttachedCbs (deviceID: string) {
  return metaMap.get(idMap.get(deviceID)!)!.attachedCbs
}

export function isOnline (deviceID:string) {
  return idMap.has(deviceID)
}

export function sendRPC (deviceID: string, msg: any) {
  const socket = idMap.get(deviceID)
  if (!socket) return false
  socket.emit('rpc', msg)
  return true
}

console.log('IO', 'Attached')
