const
  fs = require('fs'),
  path = require('path'),
  util = require('util'),
  nexe = require('nexe'),
  upx = require('upx')({ best: true, force: true, '8mibRam': true }),
  rcedit = util.promisify(require('rcedit'))

// TODO: реализовать сборку/упаковку в единый бинарник + сжимаемый после сборки

const
  PATH_BUILD = src('builds'),
  PATH_FAVICON = path.resolve('assets', 'favicon.ico'),
  PATH_OUTNAME = 'ShopManager',
  PATH_OUT = path.resolve(PATH_BUILD, `${PATH_OUTNAME}.exe`)

switch (process.argv[2]) {
  case 'build':
    build(src('release.js'), PATH_OUT)
    compress(PATH_OUT, path.resolve(PATH_BUILD, `${PATH_OUTNAME}.min.exe`))
    break
  case 'brandify':
    brandify(PATH_OUT, path.resolve(PATH_BUILD, `${PATH_OUTNAME}.branded.exe`))
    break
  case 'compress':
    compress(PATH_OUT, path.resolve(PATH_BUILD, `${PATH_OUTNAME}.min.exe`))
    break

  default:
    process.exit()
    break
}

function brandify(pathIn, pathOut) {
  return rcedit(pathIn, {
    'version-string': {
      ProductName: 'ProductName - ProductName',
      FileDescription: 'ProductName - ProductName',
      CompanyName: 'Tema Smirnov',
      LegalCopyright: 'Copyright © Tema Smirnov, 2019',
    },
    'file-version': '0.1.1.0',
    'product-version': '0.1.1.0',
    icon: PATH_FAVICON,
  })
    .catch(err => console.log(err))
    .then(() => {
      console.log('Executable `rc`edited succesfully!')
    // fs.copyFileSync(PATH_BUILD + 'file.exe', PATH_BUILD + 'file.min.exe')
    // compress(pathIn, pathOut)
    })
}

function compress(pathIn, pathOut) {
  console.log('`UPX`ing executable...')
  return upx(pathIn).output(pathOut).start().then(stats => {
    console.log('Executable `UPX`ed succesfullly!')
    console.log(stats)
  })
}

function build(pathIn, pathOut) {
  return nexe.compile({
    input: pathIn,
    target: 'win32-x86-12.13.0',
    build: false,
    resources: [
      path.join(__dirname, '../private/*.pem'),
      path.join(__dirname, '../controllers'),
      path.join(__dirname, '../databases'),
      path.join(__dirname, '../resources'),
      path.join(__dirname, '../schemas'),
      path.join(__dirname, '../.babelrc'),
    ],
    rc: {
      ProductName: 'ProductName - ProductName',
      FileDescription: 'ProductName - ProductName',
      CompanyName: 'Tema Smirnov',
      LegalCopyright: 'Copyright © Tema Smirnov, 2019',
    },
    flags: [
      '--experimental-modules',
      '--expose-gc',
    ],
    ico: PATH_FAVICON,
    output: pathOut,
    /*
      build: true, //required to use patches
      patches: [
        async (compiler, next) => {
          await compiler.setFileContentsAsync(
            'lib/new-native-module.js',
            'module.exports = 42'
          )
          return next()
        }
      ]
    */
  })
    .then(() => {
      console.log('Executable `nexe`ed succesfully!')
    /* rcedit(path.resolve(PATH_BUILD, 'build.exe'), {
      'version-string': {
        CompanyName: 'Tema Smirnov',
        FileDescription: 'ProductName - ProductName',
        LegalCopyright: 'Tema Smirnov © 2019',
        ProductName: 'ProductName - ProductName'
      },
      'file-version': '0.0.1.0',
      'product-version': '0.0.1.0',
      icon: PATH_FAVICON
    })
    .catch(err => console.log(err))
    .then(() => {
      console.log('Executable `rc`edited succesfully!')
      console.log('`UPX`ing executable...')
      // fs.copyFileSync(PATH_BUILD + 'build.exe', PATH_BUILD + 'build.min.exe')
      compress(path.resolve(PATH_BUILD, 'build.exe'), path.resolve(PATH_BUILD, 'build.upx.exe'))
    })
    */
    })
}

function src(_path) {
  return path.resolve(__dirname, '..', _path)
}
