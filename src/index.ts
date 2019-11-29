import 'reflect-metadata'
import './db/init'

import socketIO, { Socket } from 'socket.io'
import { createServer } from 'http'
import { Device } from './db/device'
import { URL } from 'url'
import { parse } from 'querystring'

const server = createServer()
const io = socketIO(server)

const idMap = new Map<string, string>()

interface SocketMeta {
  deviceID: string
  userID: string
}

const metaMap = new WeakMap<Socket, SocketMeta>()

io.use(async (socket, cb) => {
  const url = new URL(socket.request.url)
  const deviceID = parse(url.search).deviceID
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
  socket.to(userID).emit('update', { deviceID })
  socket.on('disconnect', () => {
    idMap.delete(deviceID)
  })
})

server.listen(3000, () => {
  console.log('Server started')
})
