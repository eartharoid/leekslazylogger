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

!!! info
	For `options`, see [Customisation](/customisation).

	**Please refer to [Child loggers](/child-loggers)** for information about using the logger in multiple files.

## Basic usage

Each log type (default or custom) can be used like this:

```js
log.type(text, [colours]); // colour overrides are optional
```

!!! example
	```js
	log.info('Hello world');
	```

A list of the default log types can be found [here](/log-types). Look at [this](/customisation/custom-types) page for information about custom log types
