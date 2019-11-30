
interface RPCRequest {
  m: string // RPC Call name
  u: string // A Async UUID for this RPC call
  a?: any // Arguments
}

interface RPCReply {
  u: string // UUID
  r?: any
  e?: any
}

type RPCCallback = (deviceID: string, reply: RPCReply) => void
type RPCFunction = (deviceID: string, arg?: any) => any

export class RPCHost {
  fns: Map<string, RPCFunction>
  cb: RPCCallback

  constructor (cb: RPCCallback) {
    this.fns = new Map()
    this.cb = cb
  }

  register (name: string, fn: RPCFunction) {
    if (this.fns.has(name)) {
      throw new Error('Mutiple registeration')
    }
    this.fns.set(name, fn)
  }

  invoke (deviceID: string, req: RPCRequest) {
    if (!this.fns.has(req.m)) {
      return this.cb(deviceID, { u: req.u, e: 'No such method' })
    }
    Promise.resolve(this.fns.get(req.m)!(deviceID, req.a))
      .then((r: any) => {
        this.cb(deviceID, { u: req.u, r })
      })
      .catch(e => {
        this.cb(deviceID, { u: req.u, e: e.toString() })
      })
  }
}
