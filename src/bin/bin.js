#!/usr/bin/env node

const minimist = require('minimist')
const {luapack} = require('../luapack')
const R = require('ramda')

function bin() {
  const argv = minimist(process.argv.slice(2))
  const file = R.head(argv._)

  if (R.isNil(file)) {
    console.log('No arguments supplied.') // eslint-disable-line no-console
  } else {
    const file = R.head(argv._)

    luapack(file)
      .then((data) => console.log(data)) // eslint-disable-line no-console
      .catch((error) => console.error(error)) // eslint-disable-line no-console
  }
}

bin()
