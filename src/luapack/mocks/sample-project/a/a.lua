b = require('../b/b')

local function a()
  print('Module a')
  return b()
end

return a
