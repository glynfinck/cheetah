class CheetahError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.name = 'CheetahError';
  }
}

module.exports = exports = CheetahError;
