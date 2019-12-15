import yargs from 'yargs'

export const argv = yargs
  .env('')
  .option('port', {
    alias: 'p',
    default: 3000,
    demandOption: true,
    type: 'number'
  })
  .option('databaseUrl', {
    demandOption: true,
    type: 'string'
  })
  .option('databaseType', {
    default: 'postgres',
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
