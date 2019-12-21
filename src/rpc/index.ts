import { sendRPC, getAttachedCbs } from '../io'
import uuid from 'uuid/v4'
import { Device } from '../db/device'
import { createError } from '../shared/error'

const defaultTimeout = 10 * 1000 // 10 sec
const maxTimeout = 60 * 60 * 1000 // 1 hr

interface IRPCConfig {
  s?: string
  t?: string
  o?: number
}

export type RPCCallback = (error: Error | undefined, result: any) => void
type RPCFunction = (args: any, context: IRPCConfig) => Promise<any>
type RPCFunctionEx = (context: IRPCConfig, ...args: any) => Promise<any>

const fns: Map<string, RPCFunction> = new Map()
const cbs: Map<string, RPCCallback> = new Map()

export function register (name: string, fn: RPCFunction) {
  if (fns.has(name)) {
    throw new Error('Mutiple registeration')
  }
  fns.set(name, fn)
  console.log('RPC', `+Function ${name}`)
}

export function registerEx (name: string, fn: RPCFunctionEx) {
  register(name, async (args, ctx) => {
    if (args instanceof Array) {
      return fn(ctx, ...args)
    } else if (args === undefined || args === null) {
      return fn(ctx)
    } else throw new Error('Bad args')
  })
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

async function handleRequest (asyncID: string, method: string, args: any, cfg: IRPCConfig, deviceID: string) {
  const device = await Device.findOne(deviceID)
  if (!device || !device.rpc) {
    sendRPC(deviceID, [asyncID, null, 'Access denied'])
    return
  }
  cfg.s = deviceID
  invoke(method, args, cfg).then(result => {
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
  if (typeof errstr === 'string') return cb(createError(errstr), result)
  return cb(undefined, result)
}

async function invokeClient (method: string, args: any, cfg: IRPCConfig) {
  const target = cfg.t
  if (typeof target !== 'string') throw new Error('Fail: No target')
  const timeout = cfg.o || defaultTimeout
  if (typeof timeout !== 'number' || !Number.isInteger(timeout) || timeout > maxTimeout) throw new Error('Invalid timeout')

  return new Promise((resolve, reject) => {
    const asyncID = uuid()

    let cbCalled = false
    const cb: RPCCallback = (result, error) => {
      if (cbCalled) return
      cbCalled = true
      cbs.delete(asyncID)
      getAttachedCbs(target).delete(cb)
      if (error) return reject(error)
      return resolve(result)
    }

    cbs.set(asyncID, cb)
    getAttachedCbs(target).add(cb)

    if (!sendRPC(target, [asyncID, method, args, cfg])) {
      return cb(undefined, new Error('Target offline'))
    }

    if (timeout > 0) {
      setTimeout(cb, timeout)
    }
  })
}

export async function invoke (method: string, args: any, cfg: IRPCConfig) {
  if (typeof cfg.t === 'string') {
    return invokeClient(method, args, cfg)
  } else {
    const fn = fns.get(method)
    if (!fn) throw new Error('No such method')
    return fn(args, cfg)
  }
}
