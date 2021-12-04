class KdbType {
  static nullValue = null;

  constructor(val) {
    this.value = this.convert(val);
  }

  toString() {
    return this.value;
  }

  convert(val) {
    return KdbType.convert(val);
  }

  getValue() {
    return this.value;
  }

  static _valid(val) {}

  static _convert(val) {
    return val;
  }

  static valid(val) {
    try {
      if (val !== null) {
        this._valid(val);
      }
      return null;
    } catch (err) {
      return err;
    }
  }

  static convert(val) {
    // check if the value is valid
    const err = this.valid(val);
    if (err !== null) {
      throw err;
    }

    if (val !== null) {
      return this._convert(val);
    } else {
      return this.nullValue;
    }
  }

  static isValid(val) {
    try {
      if (val !== null) {
        this._valid(val);
      }
      return true;
    } catch (err) {
      return false;
    }
  }
}

module.exports = exports = KdbType;
