# Child loggers

In your main you should have required leekslazylogger and created a new Logger instance as shown on the [Getting started](/geting-started) page.

**Do not create another Logger instance in this process.**

To use the Logger in another file, use a ChildLogger, (or you could just pass `log`).

**Using a ChildLogger**

```js
// main (eg. index.js)
const Logger = require('leekslazylogger');
const log = new Logger(options);
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
	utils.myFunction(log);
	```
