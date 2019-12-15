import { readFileSync } from 'fs'
import { join } from 'path'

export const packageJson = JSON.parse(readFileSync(join(__dirname, '..', '..', 'package.json')).toString())
