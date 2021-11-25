'use strict';

/*!
 * Module dependencies.
 */

const EventEmitter = require('events').EventEmitter;
const util = require('util');
const Connection = require('./connection');
const Table = require('./table');
const Schema = require('./schema');

/**
 * Cheetah constructor.
 *
 * The exports object of the `cheetah` module is an instance of this class.
 * Most apps will only use this one instance.
 *
 * ####Example:
 *     const cheetah = require('cheetah');
 *     cheetah instanceof cheetah.Cheetah; // true
 *
 *     // Create a new Cheetah instance with its own `connect()`, `set()`, `model()`, etc.
 *     const c = new cheetah.Cheetah();
 *
 * @api public
 */
function Cheetah() {
  this.connection = this.createConnection(); // default connection
  this.tables = {};
  this.events = new EventEmitter();

  this.connection.tables = this.tables;
}

/**
 * Creates a Connection instance.
 *
 * Each `connection` instance maps to a single database. This method is helpful when managing multiple db connections.
 *
 *
 * _Options passed take precedence over options included in connection strings._
 *
 * ####Example:
 *
 *     // with mongodb:// URI
 *     db = cheetah.createConnection('localhost',5001);
 *
 *     // and options
 *     const opts = { user: 'johndoe', pass: 'password123' }
 *     db = mongoose.createConnection('localhost', 5001, opts);
 *
 * @param {String} [host] the host url of the Kdb+ server to connect to
 * @param {Integer} [port] the port of the Kdb+ server to connect to
 * @param {String} [options.user] username for authentication, equivalent to `options.auth.user`. Maintained for backwards compatibility.
 * @param {String} [options.pass] password for authentication, equivalent to `options.auth.password`. Maintained for backwards compatibility.
 * @return {Connection} the created Connection object. Connections are thenable, so you can do `await mongoose.createConnection()`
 * @api public
 */
Cheetah.prototype.createConnection = async function (host, port) {
  const _cheetah = this instanceof Cheetah ? this : cheetah;

  const conn = new Connection(_cheetah);

  const conn_promise;
  if (host && port && typeof host !== 'string' && typeof port !== 'int') {
    await conn.connect(host, port);
  } else {
    throw Error(
      'Must provide a host and port with types of string and int respectively'
    );
  }

  this.connection = conn;

  return conn;
};

Cheetah.prototype.table = function (name, schema) {
  const _cheetah = this instanceof Cheetah ? this : cheetah;

  if (utils.isObject(schema) && !(schema instanceof Schema)) {
    schema = new Schema(schema);
  }

  // if (schema && !(schema instanceof Schema)) {
  //   throw new Error(
  //     'The 2nd parameter to `cheetah.table()` should be a ' + 'schema or a POJO'
  //   );
  // }

  const table = _cheetah._table(name, schema);

  _cheetah.connection.tables[name] = table;
  _cheetah.tables[name] = table;

  return table;
};

Cheetah.prototype._table = function (name, schema) {
  const _cheetah = this instanceof Cheetah ? this : cheetah;

  const connection = _cheetah.connection;

  table = _cheetah.Table.compile(name, schema, connection, _cheetah);

  return table;
};

Cheetah.prototype.Table = Table;

Cheetah.prototype.Schema = Schema;

/*!
 * Module exports.
 */
const cheetah = (module.exports = exports = new Cheetah());
