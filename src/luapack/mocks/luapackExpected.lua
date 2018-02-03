package.preload["a/a"] = (function (...)
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
