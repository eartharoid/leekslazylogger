# Express middleware

## Installation

`npm i leekslazylogger-express`

## Usage

```js
// set up logger with options
const ExpressLogger = require('leekslazylogger-express');
const log = new ExpressLogger({
	name: 'My express server',
	express: {
		format: '{method} &7{path}' // optional
	}
});

// require express
const express = require('express');
const app = express();

// use logger middleware
app.use(log.express);

...
// other middleware and router
...

// start server
app.listen(8080);
```

The ```app.use(log.express);``` must be one of the first middleware, before the routing.

## Options

ExpressLogger takes the [same options as normal](/customisation/options/), as well as `express.format`.

The default format is:
`{method} &7{path} {status-colour}{status} {time-colour}({time})`

The string **can** include [colour codes](/colours/#leeksjs-short-codes).

The available placeholders for setting your own format are:

- `{method}`: GET/POST etc
- `{protocol}`: HTTP or HTTPS
- `{path}`: base URL and path (no query)
- `{status-colour}` / `{status-color}`: green/orange/blue/red colour based on status code
- `{status}`: status code (200, 301, 404 etc)
- `{time-colour}` / `{time-color}`: light green/yellow/red colour based on time
- `{time}`: time in ms for request to be completed
