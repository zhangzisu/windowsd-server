const { execSync } = require('child_process')
const { join } = require('path')
const { rmdirSync, existsSync } = require('fs')

const root = join(__dirname, '..')
const build = join(root, 'build')
const frontend = join(root, 'frontend')

if (existsSync(build)) {
  console.log('~ $ rm -r build')
  rmdirSync(join(root, 'build'), { recursive: true })
}

console.log('~ $ tsc')
execSync('tsc', { cwd: root, stdio: 'inherit' })

console.log('frontend $ yarn')
execSync('yarn', { cwd: frontend, stdio: 'inherit' })
console.log('frontend $ yarn build')
execSync('yarn build', { cwd: frontend, stdio: 'inherit' })

console.log('Have a nice day :)')
