// @ts-check

/**
 * @param {string} url
 * @param {any} body
 */
export async function JSONPost (url, body) {
  const opts = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  const res = await fetch(url, opts)
  if (res.ok) {
    return res.json()
  } else {
    throw new Error(await res.text())
  }
}

/**
 * @param {string} msg
 * @returns {Error}
 */
export function createError (msg) {
  return msg.startsWith('Error: ') ? new Error(msg.substring(7)) : new Error(msg)
}
