import ko from '..'
import co from 'co'
import test from 'ava'

test('co-debug', async t => {
  t.is(ko, co)
  t.is(
    await co(function * () {
      return 'foo'
    }),
    'foo'
  )
  t.is(await co('foo'), 'foo')
  t.true(co.hasOwnProperty('default'))
  t.true(co.hasOwnProperty('co'))
  t.true(co.hasOwnProperty('wrap'))
  t.true(co === co.co)
  t.true(co === co.default)

  let err = await t.throws(co(function * foo () {
    function bar () {}
    yield bar()
    yield Promise.resolve()
  }))
  t.true(err.message.indexOf('You may only yield a function') > -1)
  t.true(err.message.indexOf(__dirname) > -1)
  t.true(err.message.indexOf('function: foo') > -1)
  t.true(err.message.indexOf('0: yield bar()') > -1)
  t.true(err.message.indexOf('1: yield Promise.resolve()') > -1)

  err = await t.throws(co(function * () {
    yield undefined
  }))
  t.true(err.message.indexOf('function: UNNAMED') > -1)
})

test('.wrap', async t => {
  t.true(typeof co.wrap === 'function')
  const fn = co.wrap(function * () {
    return yield Promise.resolve('foo')
  })
  t.true(typeof fn === 'function')

  const ret = fn()
  t.true(typeof ret === 'object')
  t.true(typeof ret.then === 'function')
  t.is(await ret, 'foo')

  const foo = co.wrap(function * () {
    yield undefined
  })
  const err = await t.throws(foo())
  t.true(err.message.indexOf('0: yield undefined') > -1)
})
