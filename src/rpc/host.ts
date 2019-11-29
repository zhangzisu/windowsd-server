
interface RPCRequest {
  n: string // RPC Call name
  d: string // A Async UUID for this RPC call
  a?: any // Arguments
}

interface RPCReply {
  d: string // UUID
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
    if (!this.fns.has(req.n)) {
      return this.cb(deviceID, { d: req.d, e: 'No such method' })
    }
    Promise.resolve(this.fns.get(req.n)!(deviceID, req.a))
      .then((r: any) => {
        this.cb(deviceID, { d: req.d, r })
      })
      .catch(e => {
        this.cb(deviceID, { d: req.d, e: e.toString() })
      })
  }
}
