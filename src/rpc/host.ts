import { sendRPC, getAttachedCbs } from '../io'
import uuid from 'uuid/v4'
import { Device } from '../db/device'

interface IRPCFnContext {
  deviceID?: string
}

export type RPCCallback = (result: any, error?: Error) => void
type RPCFunction = (args: any, context: IRPCFnContext) => Promise<any>

const fns: Map<string, RPCFunction> = new Map()
const cbs: Map<string, RPCCallback> = new Map()

export function register (name: string, fn: RPCFunction) {
  if (fns.has(name)) {
    throw new Error('Mutiple registeration')
  }
  fns.set(name, fn)
  console.log('RPC', `+Function ${name}`)
}

export async function handle (deviceID: string, msg: any) {
  if (msg instanceof Array) {
    if (msg.length === 4) {
      // Request
      const [asyncID, method, args, cfg] = msg
      return handleRequest(asyncID, method, args, cfg, deviceID)
    } else if (msg.length === 3) {
      // Response
      const [asyncID, result, errstr] = msg
      return handleResponse(asyncID, result, errstr)
    }
  }
}

async function handleRequest (asyncID: string, method: string, args: any, cfg: any, deviceID: string) {
  const device = await Device.findOne(deviceID)
  if (!device || !device.allowRPC) {
    sendRPC(deviceID, [asyncID, null, 'Access denied'])
    return
  }
  let promise: Promise<any>
  if (typeof cfg.target === 'string') {
    promise = invokeClient(cfg.target, method, args, { deviceID })
  } else {
    promise = new Promise((resolve, reject) => {
      const fn = fns.get(method)
      if (!fn) return reject(new Error('No such method'))
      return resolve(fn(args, { deviceID }))
    })
  }
  promise.then(result => {
    sendRPC(deviceID, [asyncID, result, null])
  }).catch(error => {
    sendRPC(deviceID, [asyncID, null, error.toString()])
  })
}

function handleResponse (asyncID: string, result: any, errstr: any) {
  const cb = cbs.get(asyncID)
  if (!cb) {
    console.log(`Missed response: ${asyncID}`)
    return
  }
  if (typeof errstr === 'string') return cb(result, new Error(errstr))
  return cb(result)
}

export function invokeClient (targetID: string, method: string, args: any, cfg: any) {
  const sourceID = <string>cfg.deviceID
  return new Promise((resolve, reject) => {
    const asyncID = uuid()
    const cb: RPCCallback = (result, error) => {
      cbs.delete(asyncID)
      getAttachedCbs(sourceID).delete(cb)
      if (error) return reject(error)
      return resolve(result)
    }
    cbs.set(asyncID, cb)
    getAttachedCbs(sourceID).add(cb)
    if (!sendRPC(targetID, [asyncID, method, args, cfg])) {
      cbs.get(asyncID)!(null, new Error('Target offline'))
    }
  })
}
