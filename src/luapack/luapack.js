const path = require('path')
const R = require('ramda')
const fs = require('../stdlib/fs')
const {
  processStringOnRequireMatches,
  getRelativePathToSource,
  joinModules,
} = require('../selectors')

function luapack(inputFile) {
  const modules = []
  const cwd = process.cwd()
  const sourceBasePath = path.dirname(
    path.resolve(cwd, inputFile)
  )

  function luapack(file) {
    const srcDirName = path.dirname(file)

    return fs.readFile(path.resolve(sourceBasePath, file), {encoding: 'utf8'})
      .then(function saveModuleData(data) {
        const moduleName = getRelativePathToSource(
          sourceBasePath,
          '.',
          file.replace('.lua', ''),
        )

        modules.push({
          moduleName,
          content: data,
        })

        return data
      })
      .then(processStringOnRequireMatches(sourceBasePath, srcDirName))
      .then(function replaceRequiresWithResolved(matches) {
        const currentProcessedModule = modules[modules.length - 1]
        currentProcessedModule.matches = matches
        currentProcessedModule.processedContent = (() => {
          let content = currentProcessedModule.content

          R.compose(
            R.forEach((i) => {
              content = content.replace(new RegExp(i.match, 'g'), i.resolved)
            })
          )(matches)

          return content
        })()

        return R.map(R.prop('resolvedWithExtension'), matches)
      })
      .then((requirePaths) => Promise.all(R.map(luapack, requirePaths)))
  }

  const file = path.basename(inputFile)

  return luapack(file)
    .then(() => {
      return R.compose(
        joinModules,
        R.map((i) => ({
          name: i.moduleName,
          content: i.processedContent,
        })),
        R.uniqBy(R.prop('moduleName')),
      )(modules)
    })
}

module.exports = {
  luapack,
}
