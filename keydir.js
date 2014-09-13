var ltgt = require('ltgt')

  , Keydir = function () {
      if (!(this instanceof Keydir))
        return new Keydir()

      this._keys = []
      this._len = 0
    }
  , ensureBuffer = function (value) {
      if (value && !Buffer.isBuffer(value))
        value = new Buffer(value)

      return value
    }

Keydir.prototype._sortedIndexOf = function (key) {
  var low = 0
    , high = this._keys.length
    , mid

  while (low < high) {
    mid = (low + high) >>> 1
    ltgt.compare(this._keys[mid], key) < 0 ? low = mid + 1 : high = mid
  }
  return low
}

Keydir.prototype.put = function (key) {
  key = ensureBuffer(key)

  var ix = this._sortedIndexOf(key)

  if (ix >= this._len || ltgt.compare(this._keys[ix], key) !== 0) {
    this._keys.splice(ix, 0, key)
    this._len++
  }
}

Keydir.prototype.del = function (key) {
  key = ensureBuffer(key)

  var ix = this._sortedIndexOf(key)

  if (ltgt.compare(this._keys[ix], key) === 0) {
    this._keys.splice(ix, 1)
    this._len--;
  }
}

Keydir.prototype.has = function (key) {
  key = ensureBuffer(key)

  var ix = this._sortedIndexOf(key)

  return !!this._keys[ix] && ltgt.compare(this._keys[ix], key) === 0
}

Keydir.prototype.clear = function () {
  this._keys.length = 0
  this._len = 0
}

Keydir.prototype.keys = function () {
  return this._keys
}

Keydir.prototype._rangeIndexes = function (options) {
  var lowerBound = ensureBuffer(ltgt.lowerBound(options))
    , fromIdx = lowerBound ?
        this._sortedIndexOf(lowerBound) : 0
    , upperBound = ensureBuffer(ltgt.upperBound(options))
      // toIdx - the id to slice to (exclusive)
    , toIdx = upperBound ?
        this._sortedIndexOf(upperBound) + 1 : this._keys.length

  if (ltgt.lowerBoundExclusive(options) &&
      ltgt.compare(this._keys[fromIdx], lowerBound) === 0) {
    fromIdx++
  }

  // behave correcly when the upperBound is between two keys
  if (upperBound && ltgt.compare(this._keys[toIdx - 1], upperBound) > 0) {
    toIdx--
  }

  else if (ltgt.upperBoundExclusive(options) &&
      ltgt.compare(this._keys[toIdx - 1], upperBound) === 0) {
    toIdx--
  }

  if (typeof(options.limit) === 'number' && options.limit !== -1) {
    if (options.reverse) {
      fromIdx = Math.max(toIdx - options.limit, fromIdx)
    } else {
      toIdx = Math.min(fromIdx + options.limit, toIdx)
    }
  }

  return { from: fromIdx, to: toIdx }
}

Keydir.prototype.range = function (options) {
  options = options || {}

  var indexes = this._rangeIndexes(options)
    , keys = this._keys.slice(indexes.from, indexes.to)

  if (options.reverse)
    keys = keys.reverse()

  return keys
}

module.exports = Keydir