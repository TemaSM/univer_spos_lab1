require('@babel/register')
global.Promise = require('bluebird')
Promise.config({
  longStackTraces: true,
  warnings: true,
})
process.env.NODE_ENV = 'production'

const fs = require('fs')
const open = require('open')
const totaljs = require('total.js')
const packageInfo = require('./package.json')
const packageName = `${packageInfo.displayName} v${packageInfo.version} : Server`

const isHTTPS = true

const options = {}

// options.sleep = 3000;
options.inspector = 9229
options.port = 8443 // parseInt(process.argv[2]);
options.https = {
  key: fs.readFileSync(F.path.private('certificate.pem')),
  cert: fs.readFileSync(F.path.private('key.pem')),
}

F.console = U.noop

isHTTPS ? F.https('release', options) : F.cluster.http(3, 'release', options)

process.title = packageName

if (require('cluster').isMaster) {
  setTimeout(() => {
    open(isHTTPS ? 'https://lab1.spos.mai.smirnov.one:8443/' : 'http://127.0.0.1:8443/', { app: ['chrome', '--incognito'] })
  }, 1500)
}
ON('ready', () => {
  process.title = packageName
})
// F.cluster.http(5, 'release', options);
