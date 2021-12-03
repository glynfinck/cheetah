'use strict';
const child_process = require('child_process');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');

// For starting/stopping mongod to test connections
// Adapted from mongodb-topology-manager:
// https://github.com/mongodb-js/mongodb-topology-manager/blob/master/lib/server.js
class Server {
  constructor(port, script) {
    this.port = port || 5001;
    this.script = script || 'js-websocket-requests.q';
  }

  // Start server
  start() {
    const self = this;
    return new Promise(function (resolve, reject) {
      try {
        // Spawn server process
        self.server = child_process.spawn(`${__dirname}/q/m64/q`, [
          '-p',
          self.port,
        ]);
        console.log(self.server);

        self.server.stdin.write(`\\l ${__dirname}/q/${self.script}`);

        // Wait for ready
        self.server.stdout.on('data', function (data) {
          console.log(date.toString());
          resolve();
        });

        // Error
        self.server.on('exit', function (code) {
          reject(code);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  // Stop server
  stop() {
    const self = this;
    return new Promise(function (resolve) {
      if (!self.server) {
        resolve();
      }
      // Resolve on exit
      self.server.on('exit', function (code) {
        self.server.stdout.removeAllListeners('data');
        self.server.removeAllListeners('exit');
        self.server = null;
        resolve(code);
      });
      // Kill
      self.server.stdin.write('\\\\');
      self.server.kill('SIGINT');
    });
  }
}
module.exports = Server;
