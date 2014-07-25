var ltgt = require('ltgt')

function Keydir() {
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

Keydir.prototype.range = function (options) {
  options = options || {}

  var lowerBound = ltgt.lowerBound(options)
    , fromIdx = lowerBound ?
        this._sortedIndexOf(lowerBound) : 0
    , upperBound = ltgt.upperBound(options)
      // toIdx - the id to slice to (exclusive)
    , toIdx = upperBound ?
        this._sortedIndexOf(upperBound) + 1 : this._keys.length
    , keys

  if (ltgt.lowerBoundExclusive(options) && this._keys[fromIdx] === lowerBound)
    fromIdx++

  // behave correcly when the upperBound is between two keys
  if (upperBound && this._keys[toIdx - 1] > upperBound)
    toIdx--

  if (ltgt.upperBoundExclusive(options) && this._keys[toIdx - 1] === upperBound)
    toIdx--

  if (options.limit && options.limit !== -1) {
    if (options.reverse) {
      fromIdx = Math.max(toIdx - options.limit, fromIdx)
    } else {
      toIdx = Math.min(fromIdx + options.limit, toIdx)
    }
  }

  keys = this._keys.slice(fromIdx, toIdx)

  if (options.reverse)
    keys = keys.reverse()

  return keys
}

module.exports = Keydir