# Express middleware

## Installation

`npm i leekslazylogger-express`

## Usage

```js
// set up logger with options
const ExpressLogger = require('leekslazylogger-express');
const log = new ExpressLogger({
	name: 'My express server',
});

// require express
const express = require('express');
const app = express();

// use logger middleware
app.use(log.express());

...
// other middleware and router
...

// start server
app.listen(8080);
```

The logger middleware must be one of the first middleware to be added, before the routing.

## Screenshot

![image](https://i.imgur.com/1anKOAc.png)

## Options

You can pass options to customise it:

```js
const ExpressLogger = require('leekslazylogger-express');
const log = new ExpressLogger({
	name: 'My express server',
	levels: {
		http: {
			title: 'info',
			prefix: 'http'
		}
	}
});

app.use(log.express({
	level: 'http',
	format: '{method} {route} {status}'
}));
```

### `format`

The default format is:
`{status-colour}{status}&r {method} &7{path} {time-colour}({time})`

The string **can** include [colour codes](/colours-and-styles/#short-codes).

#### Placeholders

The available placeholders for setting your own format are:

- `{method}`: GET/POST etc
- `{protocol}`: HTTP or HTTPS
- `{route}`: express route name (eg: `/users/:id`)
- `{path}`: Full path (no query)
- `{status-colour}` / `{status-color}`: green/orange/blue/red colour code based on status code (to prefix status)
- `{status}`: status code (200, 301, 404 etc)
- `{time-colour}` / `{time-color}`: light green/yellow/red colour code based on time (to prefix time)
- `{time}`: time in ms for request to be completed

### `level`

The logger level (function) to use.
The default level is `info` (`log.info()`).
