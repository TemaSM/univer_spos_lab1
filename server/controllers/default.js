export function install(options) {
  CORS()
  ROUTE('/', plain_version)
}

function plain_version() {
  this.plain('REST Service {0}\nVersion: {1}'.format(CONF.name, CONF.version))
}
