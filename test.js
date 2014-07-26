var test = require('tape')

  , keydir = require('./keydir')

test('put()', function (t) {
  var dir = keydir()

  t.deepEqual(
      dir.keys()
    , []
  )

  dir.put('foo')
  t.deepEqual(
      dir.keys()
    , [ 'foo' ]
  )

  dir.put('bar')
  t.deepEqual(
      dir.keys()
    , [ 'bar', 'foo' ]
  )

  dir.put('foo')
  t.deepEqual(
      dir.keys()
    , [ 'bar', 'foo' ]
  )

  dir.put('bas')
  t.deepEqual(
      dir.keys()
    , [ 'bar', 'bas', 'foo' ]
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
    , [ 'bar', 'baz', 'foo' ]
  )
  dir.del('foo')
  t.deepEqual(
      dir.keys()
    , [ 'bar', 'baz' ]
  )
  dir.del('bar')
  t.deepEqual(
      dir.keys()
    , [ 'baz' ]
  )
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
    , [ 'foo1', 'foo2', 'foo3', 'foo4', 'foo5' ]
  )

  t.deepEqual(
      dir.range({ limit: 3 })
    , [ 'foo1', 'foo2', 'foo3' ]
  )

  t.deepEqual(
      dir.range({ limit: -1 })
    , [ 'foo1', 'foo2', 'foo3', 'foo4', 'foo5' ]
  )

  t.deepEqual(
      dir.range({ reverse: true })
    , [ 'foo5', 'foo4', 'foo3', 'foo2', 'foo1' ]
  )

  t.deepEqual(
      dir.range({ limit: 3, reverse: true })
    , [ 'foo5', 'foo4', 'foo3' ]
  )

  t.deepEqual(
      dir.range({ gte: 'foo2', limit: 3 })
    , [ 'foo2', 'foo3', 'foo4' ]
  )

  t.deepEqual(
      dir.range({ gt: 'foo1', limit: 3 })
    , [ 'foo2', 'foo3', 'foo4' ]
  )

  t.deepEqual(
      dir.range({ lte: 'foo4', limit: 3, reverse: true })
    , [ 'foo4', 'foo3', 'foo2' ]
  )

  t.deepEqual(
      dir.range({ lt: 'foo5', limit: 3, reverse: true })
    , [ 'foo4', 'foo3', 'foo2' ]
  )

  t.deepEqual(
      dir.range({ gt: 'foo2', lt: 'foo5', limit: 3})
    , [ 'foo3', 'foo4' ]
  )

  t.deepEqual(
      dir.range({ gt: 'foo2', lt: 'foo5', limit: 3, reverse: true})
    , [ 'foo4', 'foo3' ]
  )

  t.deepEqual(
      dir.range({ lt: 'foo1.5' })
    , [ 'foo1' ]
  )

  t.deepEqual(
      dir.range({ lte: 'foo1.5' })
    , [ 'foo1' ]
  )

  t.deepEqual(
      dir.range({ gt: 'foo4.5' })
    , [ 'foo5' ]
  )

  t.deepEqual(
      dir.range({ gte: 'foo4.5' })
    , [ 'foo5' ]
  )

  t.end()
})