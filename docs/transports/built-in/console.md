# Console

## Usage

```js
const Logger = require('leekslazylogger');
const { ConsoleTransport } = require('leekslazylogger/dist/transports');
const log = new Logger({
	transports: [
		new ConsoleTransport()
	]
});
```

Or, alternatively:

```js
const Logger = require('leekslazylogger');
const log = new Logger({
	transports: [
		new Logger.transports.ConsoleTransport()
	]
});
```

## Options

??? summary "Defaults"
	See [defaults.ts](https://github.com/eartharoid/leekslazylogger/blob/main/src/transports/console/defaults.ts)

Types:

```ts
interface ConsoleTransportOptions {
	colours?: {
		[level: string]: string
	},
	format?: string | ((this: CompleteConsoleTransportOptions, log: Log) => string),
	level?: string,
	timestamp?: string | ((date: Date) => string)
}
```

### `colours`

??? summary "Default"
	```js
	colours: {
		critical: '&!4&0',
		debug: '&1',
		error: '&4',
		info: '&3',
		notice: '&!6&0',
		success: '&2',
		warn: '&6'
	}
	```
Colours used by the default format function.


### `format`

??? summary "Default"
	```js
	format: function (this: CompleteConsoleTransportOptions, log: Log): string {
		const timestamp = typeof this.timestamp === 'function' ? this.timestamp(log.timestamp) : dtf.fill(this.timestamp, log.timestamp);
		const colour = colours[log.level.name] ?? '';
		return short(`${colour}[${timestamp}] [${log.level.name.toUpperCase()}] ${log.namespace ? `(${log.namespace.toUpperCase()}) ` : ''}${log.content}`);
	}
	```

Either a string containing placeholders, or a function which returns a string.

#### String format

Placeholders:

- `{timestamp}`
- `{level}` / `{LEVEL}`
- `{namespace}` / `{NAMESPACE}`
- `{file}`
- `{line}`
- `{column}`
- `{content}`

#### Function format

To access the transport options (eg. `timestamp`) from within the function, use a classic function (not an ES6 arrow function) so `this` is the options object. The function is passed one argument, the `Log` object.

??? info "`Log` object"
	```ts
	interface Log {
		content: string,
		level: LogLevel,
		namespace: string | null,
		timestamp: Date
	}
	```

### `level`

??? summary "Default"
	```js
	level: 'info'
	```

The name of the minimum log level that this transport will receive.

### `timestamp`

??? summary "Default"
	```js
	timestamp: 'DD/MM/YY HH:mm:ss'
	```

Either a [DTF](https://github.com/eartharoid/dtf) placeholder format, or a function which takes a `Date` and returns a string.

