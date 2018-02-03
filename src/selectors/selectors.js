const R = require('ramda')
const path = require('path')

function getRequireMatches(str) {
  const tester = /require.*('|")(.*)('|")/gi
  const matches = str.match(tester)

  return R.compose(
    R.map((i) => {
      const re = /('|")(.*)('|")/i
      const matches = i.match(re)

      return R.prop(2, matches)
    }),
    (i) => R.isNil(i) ? [] : i,
  )(matches)
}

const getRelativePathToSource = R.curry(function(
  sourceBasePath,
  modulePath,
  currentPath,
) {
  return path.relative(
    sourceBasePath,
    path.resolve(sourceBasePath, modulePath, currentPath),
  )
})

const processStringOnRequireMatches = R.curry(function(
  sourceBasePath,
  srcDirName,
  str,
) {
  return R.compose(
    R.map((i) => ({
      ...i,
      resolvedWithExtension: `${i.resolved}.lua`,
    })),
    R.map((i) => ({
      match: i,
      resolved: getRelativePathToSource(sourceBasePath, srcDirName, i),
    })),
    getRequireMatches,
  )(str)
})

function wrapModule(moduleName, moduleContent) {
  return `package.preload["${moduleName}"] = (function (...)
${moduleContent}end)`
}

function joinModules(modules) {
  let mainModule = ''

  return R.compose(
    (i) => i + mainModule,
    R.reduce((acc, i) => acc + i + '\n\n', ''),
    R.map((i) => wrapModule(i.name, i.content)),
    (i) => {
      mainModule = R.path([0, 'content'], i)

      return R.tail(i)
    },
  )(modules)
}

module.exports = {
  getRequireMatches,
  getRelativePathToSource,
  processStringOnRequireMatches,
  wrapModule,
  joinModules,
}
