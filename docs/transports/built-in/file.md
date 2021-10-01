# File

## Usage

```js
const Logger = require('leekslazylogger');
const { FileTransport } = require('leekslazylogger/dist/transports');
const log = new Logger({
	transports: [
		new FileTransport()
	]
});
```

Or, alternatively:

```js
const Logger = require('leekslazylogger');
const log = new Logger({
	transports: [
		new Logger.transports.FileTransport()
	]
});
```

## Options

??? summary "Defaults"
	See [defaults.ts](https://github.com/eartharoid/leekslazylogger/blob/main/src/transports/file/defaults.ts)

Types:

```ts
interface FileTransportOptions {
	clean_directory?: number
	directory?: string
	file?: string | (() => string),
	format?: string | ((this: CompleteFileTransportOptions, log: Log) => string),
	header?: string | ((this: CompleteFileTransportOptions) => string),
	level?: string,
	name?: string,
	new_file?: 'day' | 'run',
	timestamp?: string | ((date: Date) => string)
}
```

### `clean_directory`

??? summary "Default"
	```js
	clean_directory: 7
	```

The number of days to keep log files. Set to `-1` to never delete log files.

### `directory`

??? summary "Default"
	```js
	directory: './logs'
	```

The directory to use for log files.

### `file`

??? summary "Default"
	```js
	file: 'YYYY-MM-DD.log'
	```

A string or a function that returns a string - the filename.

### `format`

??? summary "Default"
	```js
	format: function (this: CompleteFileTransportOptions, log: Log): string {
		const timestamp = typeof this.timestamp === 'function' ? this.timestamp(log.timestamp) : dtf.fill(this.timestamp, log.timestamp);
		return `[${timestamp}] [${log.level.name.toUpperCase()}] ${log.namespace ? `(${log.namespace.toUpperCase()}) ` : ''}${log.content}`;
	}
	```

Either a string containing placeholders, or a function which returns a string.

### String format

Placeholders:

- `{timestamp}`
- `{level}` / `{LEVEL}`
- `{namespace}` / `{NAMESPACE}`
- `{file}`
- `{line}`
- `{column}`
- `{content}`

### Function format

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

### `header`

??? summary "Default"
	```js
	header: function (this: CompleteFileTransportOptions): string {
		const datetime = dtf.fill('DDDD, DD MMMM YYYY at HH:mm AMPM');
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		return `\r\n\t❯ ${this.name}\r\n\t❯ Powered by leekslazylogger v${version}\r\n\t❯ Log level "${this.level}"\r\n\t❯ Node.js ${process.version} on ${process.platform}\r\n\t❯ ${datetime} (${timezone}) -->\r\n`;
	}
	```

A function which returns a string; inserted at the start of log files (or at startup if using `run` mode).
To access the transport options (eg. `timestamp`) from within the function, use a classic function (not an ES6 arrow function) so `this` is the options object.
Return an empty string to disable.

## `level`

??? summary "Default"
	```js
	level: 'info'
	```

The name of the minimum log level that this transport will receive.

## `name`

??? summary "Default"
	```js
	name: 'A leekslazylogger project'
	```

A string used in the default `header` format.

## `new_file`

??? summary "Default"
	```js
	new_file: 'day'
	```

Either `'day'` or `'run'` to create a new file every day or every time the program is run. **Change the `file`** if using `run`! 

A string used in the default `header` format.

## `timestamp`

??? summary "Default"
	```js
	timestamp: 'DD/MM/YY HH:mm:ss'
	```

Either a [DTF](https://github.com/eartharoid/dtf) placeholder format, or a function which takes a `Date` and returns a string.

