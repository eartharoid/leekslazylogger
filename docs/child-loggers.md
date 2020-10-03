# Child loggers

!!! tip
	This is no longer necessary, you can now just create a `new Logger()`.

In your main you should have required leekslazylogger and created a new Logger instance as shown on the [Getting started](/geting-started) page.

**Using a ChildLogger**

```js
// main (eg. index.js)
const Logger = require('leekslazylogger');
const log = new Logger(options);
```

```js
// another file (eg. utils.js)
const { ChildLogger } = require('leekslazylogger');
const log = new ChildLogger();

log.info('Hello');
```
