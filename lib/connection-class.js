const WebSocket = require('ws');

class Connection {
  constructor(base) {
    this.base = base;
    this._wsp = null;
  }
  connect(host, port) {
    this._wsp = new WebSocket(`ws://${host}:${port}`);

    return this;
  }
  close() {
    this._ws.close();
  }
}

module.exports = Connection;
