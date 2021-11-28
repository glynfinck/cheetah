'use strict';

/*!
 * Module dependencies.
 */

const EventEmitter = require('events').EventEmitter;
const util = require('util');
const Connection = require('../lib/connection');
const Model = require('./model-old');
const Schema = require('../lib/schema');
const types = require('../lib/schema-types');

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
  this.connection = null; // default connection
  this.models = {};
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
 * @return {Promise<Connection>} the created Connection object. Connections are thenable, so you can do `await mongoose.createConnection()`
 * @api public
 */
Cheetah.prototype.connect = async function (host, port) {
  const _cheetah = this instanceof Cheetah ? this : cheetah;

  const conn = new Connection();

  if (!host || !port || typeof host !== 'string' || typeof port !== 'number') {
    throw Error(
      'Must provide a host and port with types of string and int respectively'
    );
  }

  const connected = await conn.connect(host, port);

  this.connection = connected;
  this.connection.models = this.models;

  return connected;
};

Cheetah.prototype.close = function close(callback) {
  this.connection.close(callback);
};

Cheetah.prototype.model = function (name, schema) {
  const _cheetah = this instanceof Cheetah ? this : cheetah;

  if (utils.isObject(schema) && !(schema instanceof Schema)) {
    schema = new Schema(schema);
  }

  // if (schema && !(schema instanceof Schema)) {
  //   throw new Error(
  //     'The 2nd parameter to `cheetah.table()` should be a ' + 'schema or a POJO'
  //   );
  // }

  const model = _cheetah._model(name, schema);

  _cheetah.connection.models[name] = model;
  _cheetah.models[name] = model;

  return model;
};

Cheetah.prototype._table = function (name, schema) {
  const _cheetah = this instanceof Cheetah ? this : cheetah;

  const connection = _cheetah.connection;

  model = _cheetah.Model.compile(name, schema, connection, _cheetah);

  return model;
};

Cheetah.prototype.types = types;

Cheetah.prototype.Schema = Schema;

/*!
 * Module exports.
 */
const cheetah = (module.exports = exports = new Cheetah());
