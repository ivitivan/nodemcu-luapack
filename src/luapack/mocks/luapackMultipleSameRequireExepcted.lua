package.preload["a"] = (function (...)
c = require('c')

c()
end)

package.preload["b"] = (function (...)
c = require('c')

c()
end)

package.preload["c"] = (function (...)
return {}
end)

a = require('a')
b = require('b')

a()
b()
