import 'reflect-metadata'
import './db/init'

import socketIO, { Socket } from 'socket.io'
import { createServer } from 'http'
import { Device } from './db/device'
import { RPCHost } from './rpc/host'
import { RPCListDevices } from './rpc/api'
import express from 'express'
import { argv } from 'yargs'

const app = express()

app.get('/', (_req, res) => {
  res.redirect('https://github.com/zhangzisu/windowsd-server')
})

const server = createServer(app)
const io = socketIO(server)

const idMap = new Map<string, string>()

interface SocketMeta {
  deviceID: string
  userID: string
}

const metaMap = new WeakMap<Socket, SocketMeta>()

const host = new RPCHost((deviceID, reply) => {
  if (idMap.has(deviceID)) {
    io.to(idMap.get(deviceID)!).emit('srv-rpc', reply)
  } else {
    console.log('Missed RPC response: ' + deviceID)
  }
})

host.register('list_devices', RPCListDevices)

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
  socket.to(userID).emit('update', { deviceID })
  socket.on('disconnect', () => {
    idMap.delete(deviceID)
  })
  socket.on('p2p-rpc', (args) => {
    const dst = idMap.get(args.t)
    if (!dst) {
      if (args.hasOwnProperty!('m')) {
        // Request
        socket.emit('p2p-rpc', { t: deviceID, e: 'Target offline', u: args.u })
      } else {
        // Response
        console.log('Missed P2P response: ' + args.u)
      }
    } else {
      io.to(dst).emit('p2p-rpc', args)
    }
  })
  socket.on('srv-rpc', (args) => {
    host.invoke(deviceID, args)
  })
})

const port = parseInt((process.env.PORT || argv.port || '3000') as string, 10)
if (isNaN(port)) {
  throw new Error('Bad port')
}

server.listen(port, '::', () => {
  console.log('Server started at ' + port)
})
