# Getting started

## Installation

Install with:

=== "NPM"

	```bash
	npm i leekslazylogger
	```

=== "Yarn"

	```bash
	yarn add leekslazylogger
	```

And require it in your code:

```js
const Logger = require('leekslazylogger');
const log = new Logger({options});
```

!!! warning
	Don't create another Logger instance in this process - use [ChildLoggers](/child-loggers).

For `options`, see [Customisation/Options](/customisation/options).

Please refer to [Child loggers](/child-loggers) for information about using the logger in multiple files.

## Basic usage

Each log type (default or custom) can be used like this:

```js
log.type(text, [colours]); // colour overrides are optional
```

!!! example "Examples"
	```js
	log.info('Hello world');

	log.console('Ready.', ['green']);
	```

A list of the default log types can be found [here](/log-types). Look at [this](/customisation/custom-types) page for information about custom log types.

### Colour overrides

If you want to override the colours of a particular line you can do so like this:

```js
log.info('useful information', [foreground, background]);
```

This will colour the **entire** line, including the timestamp  & title.
`foreground` and `background` should be a resolvable [colour](/colours).
