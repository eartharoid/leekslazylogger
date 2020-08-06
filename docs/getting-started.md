# Getting started

## Installation

Install with:

```bash
npm i leekslazylogger
```

And require it in your code:

```js
const Logger = require('leekslazylogger');
const log = new Logger({options});
```

For `options`, see [Customisation](/customisation).

**Please refer to [Child Loggers](/child-loggers)** for information about using the logger in multiple files.

## Basic Usage

Each log type (default or custom) can be used like this:

```js
log.type(text, [colours]); // colour overrides are optional
```

A list of the default log types can be found [here](/log-types). Look at [this](/customisation/custom-types) page for information about custom log types
