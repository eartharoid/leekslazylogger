# Child loggers

In your index you should have required leekslazylogger and created a new Logger instance as shown on the [Getting started](/geting-started) page.

**Don't create another Logger instance in this process - use ChildLoggers.**

To use the Logger in another file (eg. `utils.js`) use a ChildLogger, (or you could just pass `log`).

**Using a ChildLogger**

Pass the `log` object to the `log.multi()` function once, then create ChildLoggers in your other files.

```js
// index.js
const Logger = require('leekslazylogger');
const log = new Logger({});
log.multi(log);
```

```js
// another file (eg. utils.js)
const { ChildLogger } = require('leekslazylogger');
const log = new ChildLogger(); // no options, inherits from main

log.info('Hello');
```

??? example "Alternative"

	```js
	// index.js
	const utils = require('./utils.js');
	utils.myFunction(log, ...);
	```
