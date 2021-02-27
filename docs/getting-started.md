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

For `options`, see [customisation](/customisation).

## Basic usage

Each [log level](/log-levels) can be used like this:

```js
log.<level>(text[, colours[, ...extra]]);
```

- `text` should be the string you want to log
- `colours` is an optional array of `[foregroundColour, backgroundColour]`
- `extra` are optional extras (like `console.log('some %s text', 'awesome', {anObject: true})`)

!!! example "Examples"
	```js
	log.console('Hello world');

	log.info('Ready.', ['magentaBright']);

	log.info(Logger.format('Status: &aonline'));
	```

A list of the default log levels can be found [here](/log-levels). See [customisation](/customisation) for information about custom log levels.

### Colour overrides

If you want to override the colours of a particular line you can do so like this:

```js
log.info('useful information', [foreground, background]);
```

`foreground` and `background` should be a resolvable [colour](/colours-and-styles).

### Inline colours

Use the `Logger.format()` function to colour text using [short codes ("&codes")](/colours-and-styles#short-codes):

```js
log.console(Logger.format('&2this is green &4and this is red'));
```

!!! tip
	You can use `Logger.f()` too.
