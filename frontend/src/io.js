// @ts-check
import io from 'socket.io-client'
import uuid from 'uuid/v4'
import { bus } from '@/bus'
import { createError } from '@/utils'

/** @type{Map<string, (error?: Error, result?: any) => void>} */
const cbs = new Map()

/** @type{SocketIOClient.Socket} */
let conn

const ioURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '/'

/**
 * @param {string} deviceID
 * @param {string} token
 */
export function connect (deviceID, token) {
  conn && conn.close()
  conn = io(ioURL, { query: { deviceID, token } })
  conn.on('system', (...msg) => {
    bus.$emit('system', ...msg)
  })
  conn.on('rpc', handle)
  conn.on('disconnect', () => console.log('Disconnect'))
  conn.on('reconnect', () => console.log('Reconnect'))
  return new Promise((resolve, reject) => {
    conn.once('connect', () => {
      bus.$emit('login')
      resolve()
    })
    conn.once('error', (e) => {
      bus.$emit('logout')
      conn.removeAllListeners()
      conn = undefined
      reject(e)
    })
  })
}

export function disconnect () {
  if (conn) {
    conn.removeAllListeners()
    conn.close()
    conn = undefined
    bus.$emit('logout')
  }
}

/**
 * @param {any} msg
 */
function handle (msg) {
  if (msg instanceof Array) {
    if (msg.length === 4) {
      // Request
      // const [asyncID, method, args, cfg] = msg
      // return handleRequest(asyncID, method, args, { l: true, ...cfg })
    } else if (msg.length === 3) {
      // Response
      const [asyncID, result, errstr] = msg
      return handleResponse(asyncID, result, errstr)
    }
  }
}

/**
 * @param {string} asyncID
 * @param {any} result
 * @param {string} errstr
 */
function handleResponse (asyncID, result, errstr) {
  const cb = cbs.get(asyncID)
  if (!cb) {
    console.log(`Missed response: ${asyncID}`)
    return
  }
  if (typeof errstr === 'string') return cb(createError(errstr), result)
  return cb(undefined, result)
}

/**
 * @param {string} method
 * @param {any} args
 * @param {any} cfg
 * @returns {Promise<any>}
 */
export async function invoke (method, args, cfg) {
  if (!conn) throw new Error('Not connected')
  return new Promise((resolve, reject) => {
    const asyncID = uuid()
    cbs.set(asyncID, (error, result) => {
      cbs.delete(asyncID)
      if (error) return reject(error)
      return resolve(result)
    })
    conn.emit('rpc', [asyncID, method, args, cfg])
  })
}
