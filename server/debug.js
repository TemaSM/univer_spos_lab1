require('@babel/register')
global.Promise = require('bluebird')
Promise.config({
  longStackTraces: true,
  warnings: true,
})

const options = {}

// options.ip = '127.0.0.1';
// options.port = parseInt(process.argv[2]);
// options.config = { name: 'Total.js' };
// options.sleep = 3000;
options.inspector = 9229
// options.watch = ['private'];

require('total.js/debug')(options)
