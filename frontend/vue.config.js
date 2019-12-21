const { DefinePlugin } = require('webpack')
const { hostname } = require('os')

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000/'
      }
    },
    disableHostCheck: true
  },
  configureWebpack: {
    plugins: [
      new DefinePlugin({
        'BUILD_DATE': JSON.stringify((new Date()).toLocaleString()),
        'BUILD_MACHINE': JSON.stringify(hostname())
      })
    ]
  }
}
