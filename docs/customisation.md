# Customisation

See [`defaults.js`](https://github.com/eartharoid/leekslazylogger/blob/master/lib/defaults.js
) for defaults.

## Logger options

Types:

```ts
{
	name?: String,
	logToFile?: Boolean,
	header?: Boolean,
	timestamp?: String,
	maxAge?: Number,
	keepSilent?: Boolean,
	debug?: Boolean,
	daily?: Boolean,
	directory?: String,
	levels?: Object
}
```

??? summary "name"
	## name

	The name of your program. Appears in log file headers.

??? summary "logToFile"
	## logToFile

	Create and use log files?

??? summary "header"
	## header

	Include the header in log files?

??? summary "timestamp"
	## timestamp

	A [dtf](https://github.com/eartharoid/dtf#readme) timestamp format.

??? summary "maxAge"
	## maxAge

	The number of days to keep log files for.

??? summary "keepSilent"
	## keepSilent

	Disable the logger's startup messages?

??? summary "debug"
	## debug

	If false, log levels with the type of `debug` are ignored.

??? summary "daily"
	## daily

	Create 1 file per day? Otherwise creates 1 file per run.

??? summary "directory"
	## directory

	The logs directory path.

??? summary "levels"
	## levels

	Customise your logger's [log levels](#log-levels).

## Log levels

```ts
{
	type?: String,
	format: String | Function
}
```

Use the `levels` option to override the [defaults](/log-levels), or create new ones.

Each level must have a `format` property which is either a string, or a function which returns a string.

The `format` may contain [short codes](/colours-and-styles#short-codes) and the following placeholders:

- `{timestamp}` - The formatted [timestamp](#timestamp) string
- `{text}` - The text to be logged

To use RGB, HEX, or 8Bit colours you need to import [leeks.js](https://docs.davidjcralph.co.uk/#/leeks). You don't need to install it as it a dependency of leekslazylogger.

Each level can optionally have a `type` property: `console[type](...)`.

!!! example
	```js
	const Logger = require('leekslazylogger');
	const log = new Logger({
		levels: {
			db: {
				type: 'debug', // optional
				format: '[{timestamp} | DEBUG] &7[DATABASE]&r {text}'
			}
		}
	});
	log.db('Some boring information about the database');
	```

More [examples](https://github.com/eartharoid/leekslazylogger/tree/master/test).
