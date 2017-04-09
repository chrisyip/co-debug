# co-debug

[![node](https://img.shields.io/node/v/gh-badges.svg)]() [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Travis CI][travis-image]][travis-url] [![codecov][codecov-image]][codecov-url]

Better debug information for co.

`co-debug` turns

```
TypeError: You may only yield a function, promise, generator, array, or object, but the following object was passed: "undefined"
    at next (co-debug/node_modules/co/index.js:101:25)
    ...
```

into

```
TypeError: You may only yield a function, promise, generator, array, or object, but the following object was passed: "undefined"
  co-debug/test/test.js function: foo
  0: yield bar()
  1: yield Promise.resolve()
    at next (co-debug/node_modules/co/index.js:101:25)
    ...
```

## Install

```
npm i co-debug
```

You may need to install `co` by yourself.

## Usage

```
node -r co-debug
```

Or add `require('co-debug')` to your main file and make sure load it before other packages:

```js
require('co-debug')
const Koa = require('koa')
const app = new Koa()
app.use(function * () {})
```

## Notes

### `co-debug` has some limitations

`co-debug` only can tell:

- The function name that throws error
- The list of `yield` within the function
- The file path that contains the function

Examples:

```
co-debug/test/test.js function: foo
0: yield bar()
1: yield Promise.resolve()
```

`co-debug` may have trouble working with transpilers.

### Only use `co-debug` when needed

```js
if (process.env.NODE_ENV !== 'production') {
  require('co-debug')
}
const co = require('co')
// other stuffs
```

[npm-url]: https://npmjs.org/package/co-debug
[npm-image]: http://img.shields.io/npm/v/co-debug.svg
[daviddm-url]: https://david-dm.org/chrisyip/co-debug
[daviddm-image]: http://img.shields.io/david/chrisyip/co-debug.svg
[travis-url]: https://travis-ci.org/chrisyip/co-debug
[travis-image]: http://img.shields.io/travis/chrisyip/co-debug.svg
[codecov-url]: https://codecov.io/gh/chrisyip/co-debug
[codecov-image]: https://img.shields.io/codecov/c/github/chrisyip/co-debug.svg
