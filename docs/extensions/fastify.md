# Fastify plugin

## Installation

`npm i leekslazylogger-fastify`

## Usage

```js
// set up logger with options
const FastifyLogger = require('leekslazylogger-fastify');
const log = new FastifyLogger({
	name: 'My fastify server',
});

// require fastify
const fastify = require('fastify');
const server = fastify();

// use logger plugin
server.use(log.fastify());

...
// other plugins and router
...

// start server
server.listen(8080);
```

The logger plugin must be one of the first plugins to be registered, before the routing.

## Screenshot

![image](https://i.imgur.com/1anKOAc.png)

## Options

You can pass options to customise it:

```js
const FastifyLogger = require('leekslazylogger-fastify');
const log = new FastifyLogger({
	name: 'My fastify server',
	levels: {
		http: {
			title: 'info',
			prefix: 'http'
		}
	}
});

server.use(log.fastify(), {
	level: 'http',
	format: '{method} {route} {status}'
});
```

### `format`

The default format is:
`{status-colour}{status}&r {method} &7{path} {time-colour}({time})`

The string **can** include [colour codes](/colours-and-styles/#short-codes).

#### Placeholders

The available placeholders for setting your own format are:

- `{method}`: GET/POST etc
- `{protocol}`: HTTP or HTTPS
- `{route}`: fastify route name (eg: `/users/:id`)
- `{path}`: Full path (no query)
- `{status-colour}` / `{status-color}`: green/orange/blue/red colour code based on status code (to prefix status)
- `{status}`: status code (200, 301, 404 etc)
- `{time-colour}` / `{time-color}`: light green/yellow/red colour code based on time (to prefix time)
- `{time}`: time in ms for request to be completed

### `level`

The logger level (function) to use.
The default level is `info` (`log.info()`).
