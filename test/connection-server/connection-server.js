'use strict';
const child_process = require('child_process');

// For starting/stopping Kdb+/Q server to test connections
// Adapted from mongoose connection_server.js:
// https://github.com/Automattic/mongoose/blob/master/test/connection_server.js
class Server {
  constructor(binary, options = {}) {
    this.binary = binary;
    this.host = options['host'] || '127.0.0.1';
    this.port = options['port'] || 5001;
  }

  // Start server
  start() {
    const self = this;
    return new Promise(function (resolve, reject) {
      try {
        // Spawn server process
        self.server = child_process.spawn(self.binary, [
          '-p',
          `${self.host}:${self.port}`,
        ]);

        // Wait for ready
        self.server.stdout.on('data', function (data) {
          // First standard output should be from writing "\p" below
          const portReponse = Number(
            data.toString().substring(0, data.toString().length - 2)
          );
          // We will resolve if this is equal to self.port
          // indicating that our server is running
          if (portReponse === self.port) {
            resolve();
          }
        });

        // Add the websocket script to the Kdb+/Q server
        self.server.stdin.write(`\\l ${__dirname}/websocket.q\n`);

        // Send test message to trigger resolution of the promise
        self.server.stdin.write(`\\p\n`);
        self.server.stdin.pause();

        // Handle errors in the Kdb+/Q server
        self.server.stderr.on('data', function (data) {
          reject(data.toString());
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
      self.server.stdin.pause();
      self.server.kill();
    });
  }
}

module.exports = Server;
