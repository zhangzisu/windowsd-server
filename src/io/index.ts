import socketIO, { Socket } from 'socket.io'
import { Device } from '../db/device'
import { server } from '../http'
import { handle, RPCCallback } from '../rpc/host'

export const io = socketIO(server)
const idMap = new Map<string, Socket>()

interface SocketMeta {
  deviceID: string
  userID: string
  attachedCbs: Set<RPCCallback>
}

const metaMap = new WeakMap<Socket, SocketMeta>()

io.use(async (socket, cb) => {
  const deviceID = socket.handshake.query.deviceID
  if (typeof deviceID !== 'string') {
    return cb(new Error('Bad Header'))
  } else {
    if (metaMap.has(socket)) return cb()
    const device = await Device.findOne(deviceID, { relations: ['user'] })
    if (device) {
      if (idMap.has(deviceID)) {
        const old = idMap.get(deviceID)!
        old.error(new Error('Bad Device'))
        old.disconnect(true)
      }
      idMap.set(deviceID, socket)
      metaMap.set(socket, { deviceID, userID: device.user.id, attachedCbs: new Set() })
      return cb()
    } else {
      return cb(new Error('Bad Device'))
    }
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
      cb(null, new Error('Client offline'))
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

export function sendRPC (deviceID: string, msg: any) {
  const socket = idMap.get(deviceID)
  if (!socket) return false
  socket.emit('rpc', msg)
  return true
}

console.log('IO', 'Attached')
