/*!
 * Module dependencies.
 */

const EventEmitter = require('events').EventEmitter;
const util = require('util');
const Connection = require('./connection');
const Model = require('./model');
const Schema = require('./schema');
const types = require('./schema-types');

class Cheetah {
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
  constructor() {
    this.connection = null; // default connection
    this.models = {};
    this.types = types;
    this.Schema = Schema;
    this.Model = Model;
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
   *     // with host and port
   *     db = cheetah.createConnection('localhost',5001);
   *
   *
   * @param {String} [host] the host url of the Kdb+ server to connect to
   * @param {Integer} [port] the port of the Kdb+ server to connect to
   * @param {String} [options.user] username for authentication, equivalent to `options.auth.user`. Maintained for backwards compatibility.
   * @param {String} [options.pass] password for authentication, equivalent to `options.auth.password`. Maintained for backwards compatibility.
   * @return {Promise<Connection>} the created Connection object. Connections are thenable, so you can do `await mongoose.createConnection()`
   * @api public
   */
  async connect(host, port) {
    const _cheetah = this instanceof Cheetah ? this : cheetah;

    const conn = new Connection();

    if (
      !host ||
      !port ||
      typeof host !== 'string' ||
      typeof port !== 'number'
    ) {
      throw Error(
        'Must provide a host and port with types of string and int respectively'
      );
    }

    const connected = await conn.connect(host, port);

    _cheetah.connection = connected;
    _cheetah.connection.models = _cheetah.models;

    return connected;
  }

  async close() {
    await this.connection.close();
  }

  /**
   * Creates a new model for a table in Kdb+ database.
   *
   * ####Example:
   *
   *     const tradeSchema = new cheetah.Schema({
   *       date : { type: KDate },
   *       time : { type: Time },
   *       sym : { type : Symbol }
   *     });
   *
   *     const Trade = cheetah.model('Trade', tradeSchema);
   *
   *
   * @param {String} name the name for the model
   * @param {(Schema|Object)} schema the schema class for the model
   * @return {Promise<Model>} the created model
   * @api public
   */
  async model(name, schema) {
    const _cheetah = this instanceof Cheetah ? this : cheetah;

    if (util.isObject(schema) && !(schema instanceof Schema)) {
      schema = new Schema(schema);
    }

    if (schema && !(schema instanceof Schema)) {
      throw new Error(
        'The 2nd parameter to `cheetah.table()` should be a ' +
          'schema or a POJO'
      );
    }

    const model = await _cheetah._model(name, schema);

    _cheetah.connection.models[name] = model;
    _cheetah.models[name] = model;

    return model;
  }

  async _model(name, schema) {
    const _cheetah = this instanceof Cheetah ? this : cheetah;

    const connection = _cheetah.connection;

    const model = await _cheetah.Model.compile(
      name,
      schema,
      connection,
      _cheetah
    );

    return model;
  }
}

const cheetah = (module.exports = exports = new Cheetah());
