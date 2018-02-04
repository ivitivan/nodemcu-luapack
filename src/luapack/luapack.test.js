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
      t.deepEqual(actual, expected)
    })
})

test('luapack - dont include multiple copies of same module', (t) => {
  t.plan(1)

  Promise.all([
    luapack(path.resolve(
      __dirname,
      './mocks/sample-project-with-multiple-same-requires/init.lua',
    )),
    fs.readFile(path.resolve(__dirname, './mocks/luapackMultipleSameRequireExepcted.lua'), {encoding: 'utf8'}),
  ])
    .then(([actual, expected]) => {
      t.deepEqual(actual, expected)
    })
})
