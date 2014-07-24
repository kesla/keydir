var ltgt = require('ltgt')

  , Keydir = function () {
      if (!(this instanceof Keydir))
        return new Keydir()

      this._keys = []
      this._len = 0
    }

Keydir.prototype._sortedIndexOf = function (key) {
  var low = 0
    , high = this._keys.length
    , mid

  while (low < high) {
    mid = (low + high) >>> 1
    this._keys[mid] < key ? low = mid + 1 : high = mid
  }
  return low
}

Keydir.prototype.put = function (key) {
  var ix = this._sortedIndexOf(key)

  if (ix >= this.len || this._keys[ix] !== key) {
    this._keys.splice(ix, 0, key)
    this._len++
  }
}

Keydir.prototype.del = function (key) {
  var ix = this._sortedIndexOf(key)
  if (this._keys[ix] == key) {
    this._keys.splice(ix, 1)
    this._len--;
  }
}

Keydir.prototype.keys = function () {
  return this._keys
}

Keydir.prototype.range = function (opts) {
  opts = opts || {}
  var keys = this._keys.filter(ltgt.filter(opts))

  if (opts.reverse)
    keys.reverse()

  if (opts.limit && opts.limit !== -1)
    keys = keys.slice(0, opts.limit)

  return keys
}

module.exports = Keydir