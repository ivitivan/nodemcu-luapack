const test = require('tape')
const path = require('path')
const {luapack} = require('./luapack')
const fs = require('../stdlib/fs')

test('luapack', (t) => {
  t.plan(1)

  Promise.all([
    luapack(path.resolve(
      __dirname,
      './mocks/sample-project/init.lua',
    )),
    fs.readFile(path.resolve(__dirname, './mocks/luapackExpected.lua'), {encoding: 'utf8'}),
  ])
    .then(([actual, expected]) => {
      fs.writeFile('/tmp/actual.txt', JSON.stringify(actual, null, 2))
      fs.writeFile('/tmp/expected.txt', JSON.stringify(expected, null, 2))
      t.deepEqual(actual, expected)
    })
})
