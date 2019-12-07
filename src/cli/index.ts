import yargs from 'yargs'

export const argv = yargs
  .option('port', {
    alias: 'p',
    default: 3000,
    demandOption: true,
    type: 'number'
  })
  .option('db', {
    default: 'main.db',
    type: 'string'
  })
  .option('dbUser', {
    default: 'test',
    type: 'string'
  })
  .option('dbPass', {
    default: 'password',
    type: 'string'
  })
  .option('dbType', {
    default: 'sqlite',
    demandOption: true,
    type: 'string'
  })
  .option('https', {
    default: false,
    type: 'boolean'
  })
  .option('key', {
    type: 'string'
  })
  .option('cert', {
    type: 'string'
  })
  .argv
