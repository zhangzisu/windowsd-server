import socketIO, { Socket } from 'socket.io'
import { Device } from '../db/device'
import { server } from '../http'
import { handle } from '../rpc/host'

export const io = socketIO(server)

const idMap = new Map<string, string>()

interface SocketMeta {
  deviceID: string
  userID: string
}

const metaMap = new WeakMap<Socket, SocketMeta>()

io.use(async (socket, cb) => {
  const deviceID = socket.handshake.query.deviceID
  if (typeof deviceID !== 'string') {
    cb(new Error('Bad Header'))
  } else {
    const device = await Device.findOne(deviceID, { relations: ['user'] })
    if (device) {
      if (idMap.has(deviceID)) {
        cb(new Error('Bad Device'))
      } else {
        idMap.set(deviceID, socket.id)
        metaMap.set(socket, { deviceID, userID: device.user.id })
        cb()
      }
    } else {
      cb(new Error('Bad Device'))
    }
  }
})

io.on('connection', (socket) => {
  const { userID, deviceID } = metaMap.get(socket)!
  socket.join(userID)
  socket.to(userID).emit('update', { deviceID, event: 'online' })
  socket.on('disconnect', () => {
    socket.to(userID).emit('update', { deviceID, event: 'offline' })
    idMap.delete(deviceID)
  })
  socket.on('rpc', (msg) => {
    handle(deviceID, msg)
      .catch((e: any) => {
        console.log(e)
      })
  })
})

export function sendRPC (deviceID: string, msg: any) {
  const id = idMap.get(deviceID)
  if (!id) return false
  io.to(id).emit('rpc', msg)
  return true
}

console.log('IO', 'Attached')
