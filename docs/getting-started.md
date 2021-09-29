# Getting started

## Installation

Install with:

=== "pnpm"

	```bash
	pnpm add leekslazylogger
	```

=== "npm"

	```bash
	npm i leekslazylogger
	```

=== "yarn"

	```bash
	yarn add leekslazylogger
	```

And require it in your code:

```js
const Logger = require('leekslazylogger');
const log = new Logger(options);
```

For `options`, see [customisation](/customisation). Omit options to use the defaults.

## Basic usage

```js
log[level](...content)
// or
log[level][namespace](...content)
```

### Examples

??? summary "Default levels"
	- `debug`
	- `verbose`
	- `info`
	- `success`
	- `warn`
	- `notice`
	- `error`
	- `critical`

```js
log.info('information', 'more information');
log.error('oops!', new Error('an error'));
log.debug('something happened!', { something: ['hello', 'world'] });
```

```js
// in your options:
namespaces: ['commands', 'plugins', 'http']

// ...
log.error.commands('an error occurred during command execution')
log.success.plugins('loaded a plugin')
log.info.http('received a request from someone')
```