export function createError (msg: string) {
  return msg.startsWith('Error: ') ? new Error(msg.substring(7)) : new Error(msg)
}
