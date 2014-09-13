var test = require('tape')

  , keydir = require('./keydir')
  , transformArray = function (array) {
      return array.map(function (string) { return new Buffer(string) })
    }

test('put()', function (t) {
  var dir = keydir()

  t.deepEqual(
      dir.keys()
    , transformArray([])
  )

  dir.put('foo')
  t.deepEqual(
      dir.keys()
    , transformArray([ 'foo' ])
  )

  dir.put('bar')
  t.deepEqual(
      dir.keys()
    , transformArray([ 'bar', 'foo' ])
  )

  dir.put('foo')
  t.deepEqual(
      dir.keys()
    , transformArray([ 'bar', 'foo' ])
  )

  dir.put('bas')
  t.deepEqual(
      dir.keys()
    , transformArray([ 'bar', 'bas', 'foo' ])
  )

  t.end()
})

test('del()', function (t) {
  var dir = keydir()

  dir.put('foo')
  dir.put('bar')
  dir.put('baz')

  dir.del('uknown')

  t.deepEqual(
      dir.keys()
    , transformArray([ 'bar', 'baz', 'foo' ])
  )
  dir.del('foo')
  t.deepEqual(
      dir.keys()
    , transformArray([ 'bar', 'baz' ])
  )
  dir.del('bar')
  t.deepEqual(
      dir.keys()
    , transformArray([ 'baz' ])
  )
  t.end()
})

test('clear()', function (t) {
  var dir = keydir()

  dir.put('beep')
  dir.put('boop')
  dir.clear()
  t.deepEqual(dir.keys(), [])
  t.end()
})

test('range()', function (t) {
  var dir = keydir()

  t.deepEqual(dir.range({}), [])
  t.deepEqual(dir.range(), [])

  dir.put('foo1')
  dir.put('foo2')
  dir.put('foo3')
  dir.put('foo4')
  dir.put('foo5')

  t.deepEqual(
      dir.range()
    , transformArray([ 'foo1', 'foo2', 'foo3', 'foo4', 'foo5' ])
  )

  t.deepEqual(
      dir.range({ limit: 3 })
    , transformArray([ 'foo1', 'foo2', 'foo3' ])
  )

  t.deepEqual(
      dir.range({ limit: -1 })
    , transformArray([ 'foo1', 'foo2', 'foo3', 'foo4', 'foo5' ])
  )

  t.deepEqual(
      dir.range({ reverse: true })
    , transformArray([ 'foo5', 'foo4', 'foo3', 'foo2', 'foo1' ])
  )

  t.deepEqual(
      dir.range({ limit: 3, reverse: true })
    , transformArray([ 'foo5', 'foo4', 'foo3' ])
  )

  t.deepEqual(
      dir.range({ gte: 'foo2', limit: 3 })
    , transformArray([ 'foo2', 'foo3', 'foo4' ])
  )

  t.deepEqual(
      dir.range({ gt: 'foo1', limit: 3 })
    , transformArray([ 'foo2', 'foo3', 'foo4' ])
  )

  t.deepEqual(
      dir.range({ lte: 'foo4', limit: 3, reverse: true })
    , transformArray([ 'foo4', 'foo3', 'foo2' ])
  )

  t.deepEqual(
      dir.range({ lt: 'foo5', limit: 3, reverse: true })
    , transformArray([ 'foo4', 'foo3', 'foo2' ])
  )

  t.deepEqual(
      dir.range({ gt: 'foo2', lt: 'foo5', limit: 3})
    , transformArray([ 'foo3', 'foo4' ])
  )

  t.deepEqual(
      dir.range({ gt: 'foo2', lt: 'foo5', limit: 3, reverse: true})
    , transformArray([ 'foo4', 'foo3' ])
  )

  t.deepEqual(
      dir.range({ lt: 'foo1.5' })
    , transformArray([ 'foo1' ])
  )

  t.deepEqual(
      dir.range({ lte: 'foo1.5' })
    , transformArray([ 'foo1' ])
  )

  t.deepEqual(
      dir.range({ gt: 'foo4.5' })
    , transformArray([ 'foo5' ])
  )

  t.deepEqual(
      dir.range({ gte: 'foo4.5' })
    , transformArray([ 'foo5' ])
  )

  dir.clear()

  dir.put('00')
  dir.put('01')
  dir.put('02')
  dir.put('03')

  t.deepEqual(
      dir.range({ lt: '0' })
    , []
  )

  t.deepEqual(
      dir.range({ limit: 0 })
    , []
  )

  t.end()
})

test('has()', function (t) {
  var dir = keydir()

  t.equal(dir.has('beep'), false)
  dir.put('beep')
  dir.put('been')
  t.equal(dir.has('beeo'), false)
  t.equal(dir.has('beep'), true)
  t.equal(dir.has('beeq'), false)
  dir.del('beep')
  t.equal(dir.has('beep'), false)

  t.end()
})

test('Buffers & Strings', function (t) {
  var dir = keydir()

  dir.put(new Buffer([ 128 ]))
  dir.put('beep boop')
  t.deepEqual(
      dir.range()
    , [ new Buffer('beep boop'), new Buffer([ 128 ]) ]
  )
  t.deepEqual(
      dir.range({ gt: new Buffer([ 127 ]) })
    , [ new Buffer( [ 128 ] ) ]
  )
  t.deepEqual(
      dir.range({ gt: new Buffer([ 129 ]) })
    , [ ]
  )

  dir.del(new Buffer('beep boop'))

  t.deepEqual(
      dir.range()
    , [ new Buffer([ 128 ]) ]
  )

  dir.put(new Buffer([ 127 ]))
  t.deepEqual(
      dir.range()
    , [ new Buffer([ 127 ]), new Buffer([ 128 ]) ]
  )

  t.end()
})