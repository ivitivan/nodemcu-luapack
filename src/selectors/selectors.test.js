const test = require('tape')
const {
  getRequireMatches,
  getRelativePathToSource,
  processStringOnRequireMatches,
  wrapModule,
  joinModules,
} = require('./selectors')
const fs = require('../stdlib/fs')
const path = require('path')

test('getRequireMatches - one require', (t) => {
  t.plan(1)

  fs.readFile(path.resolve(__dirname, './mocks/getRequireMatchesInputOneRequire.lua'), {encoding: 'utf8'})
    .then((input) => {
      const expected = ['./a/a']
      const actual = getRequireMatches(input)

      t.deepEqual(actual, expected)
    })
})

test('getRequireMatches - multiple require', (t) => {
  t.plan(1)

  fs.readFile(path.resolve(__dirname, './mocks/getRequireMatchesInputMultipleRequire.lua'), {encoding: 'utf8'})
    .then((input) => {
      const expected = [
        './a/a',
        './b',
        './helpers/selectors/c',
      ]
      const actual = getRequireMatches(input)

      t.deepEqual(actual, expected)
    })
})

test('getRequireMatches - no matches found', (t) => {
  t.plan(1)

  const expected = []
  const actual = getRequireMatches('')

  t.deepEqual(actual, expected)
})

test('getRelativePathToSource', (t) => {
  t.plan(1)

  const sourceBasePath = '/tmp/my-project'
  const currentPathOfModule = './b'
  const requirePath = '../c/c'
  const expected = 'c/c'
  const actual = getRelativePathToSource(
    sourceBasePath,
    currentPathOfModule,
    requirePath,
  )

  t.deepEqual(actual, expected)
})

test('processStringOnRequireMatches', (t) => {
  t.plan(1)

  const sourceBasePath = '/tmp/my-project'
  const currentPathOfModule = './b'
  const str = `a = require('./a/a')

function main()
  print(a())
end

main()
`
  const expected = [
    {
      match: './a/a',
      resolved: 'b/a/a',
      resolvedWithExtension: 'b/a/a.lua',
    },
  ]
  const actual = processStringOnRequireMatches(
    sourceBasePath,
    currentPathOfModule,
    str,
  )

  t.deepEqual(actual, expected)
})

test('wrapModule', (t) => {
  t.plan(1)

  const actual = wrapModule('someModule', 'print("Hello, World!")')
  const expected = `package.preload["someModule"] = (function (...)
print("Hello, World!")end)`

  t.deepEqual(actual, expected)
})

test('joinModules', (t) => {
  t.plan(1)

  const modules = [
    {
      name: 'init.lua',
      content: 'a = require(\'a/a\')\n\nfunction main()\n  print(a())\nend\n\nmain()\n',
    },
    {
      name: 'a/a',
      content: 'b = require(\'b/b\')\n\nlocal function a()\n  print(\'Module a\')\n  return b()\nend\n\nreturn a\n',
    },
    {
      name:     'b/b',
      content: 'return function()\n  return \'Module b\'\nend\n',
    },
  ]
  const actual = joinModules(modules)
  const expected = `package.preload["a/a"] = (function (...)
b = require('b/b')

local function a()
  print('Module a')
  return b()
end

return a
end)

package.preload["b/b"] = (function (...)
return function()
  return 'Module b'
end
end)

a = require('a/a')

function main()
  print(a())
end

main()
`

  fs.writeFile('/tmp/actual', actual)
  fs.writeFile('/tmp/expected', expected)
  t.deepEqual(actual, expected)
})

