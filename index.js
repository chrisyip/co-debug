'use strict'

const co = require('co')
const esprima = require('esprima')

function handleError (gen, e) {
  if (
    typeof gen === 'function' &&
    e instanceof Error &&
    e.message.indexOf('You may only yield a function') > -1
  ) {
    const genBody = gen.toString()
    const tokens = esprima.tokenize(genBody, { loc: true })
    let infos = []
    const lines = genBody.split('\n')

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]

      if (token.type === 'Keyword' && token.value === 'yield') {
        infos.push(
          `${infos.length}: ${(lines[token.loc.start.line - 1]).trim()}`
        )
      }
    }

    if (infos.length > 0) {
      e.message = `${e.message}
  ${module.parent.filename} function: ${gen.name || 'UNNAMED'}
  ${infos.join('\n  ')}`
    }
  }

  throw e
}

function ko (gen) {
  return co.apply(this, arguments).catch(e => {
    handleError(gen, e)
  })
}

ko.wrap = function (fn) {
  function createPromise () {
    return ko.call(this, fn).catch(e => {
      handleError(fn, e)
    })
  }
  createPromise.__generatorFunction__ = fn
  return createPromise
}

module.exports = ko['default'] = ko.co = ko

const Module = require('module')
const load = Module._load
Module._load = function (mod) {
  if (mod === 'co') {
    return ko
  }
  return load.apply(this, arguments)
}
