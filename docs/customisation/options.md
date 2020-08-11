# Options

When you create your Logger instance you can pass an object containing options & custom log types:

```js
const Logger = require('leekslazylogger');
const log = new Logger({});
```

The object may take up many lines, so you could:

```js
// index
const log = new Logger(require('./logger.js'));
```

```js
// logger.js
const { debug_mode } = require('./config.js');
module.exports = {
	name: 'Example',
	custom: {...},
	debug: debug_mode
}
```

## Available options

### name

- Appears in the header of log files.
- Type: string
- Default: `A leekslazylogger project`

??? example

	```js
	name: 'Example project',
	```

### logToFile

- Should everything be logged into a file for future reference?
- Type: boolean
- Default: `true`

??? example

	```js
	logToFile: false,
	```

### timestamp

- A valid timestamp format. Refer to [dtf docs](https://github.com/eartharoid/dtf/#placeholders).
- Type: string
- Default: `HH:mm:ss`

??? example

	```js
	timestamp: 'DD/MM hh:mm AMPM',
	```

### maxAge

- How long should old log files be kept for (in days)?
- Type: integer
- Default: `7`

??? example

	```js
	maxAge: 30,
	```

### keepSilent

- Disable verbose from the logger? Quieter startup; errors and warnings will still be shown.
- Type: boolean
- Default: `false`

??? example

	```js
	keepSilent: true,
	```

### debug

- Should debug messages be logged. If false, `log.debug()` is ignored.
- Type: boolean
- Default: `false`

??? example

	```js
	debug: config.debug,
	```

### custom

- An object of custom log types. **See [Custom types](../custom-types)**.
- Type: object

??? example

	```js
	custom: {
		sql: {
			title: 'MySQL',
			foreground: 'bluebright',
			type: 'info'
		},
	},
	```
