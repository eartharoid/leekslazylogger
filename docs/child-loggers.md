# Child loggers

In your index you should have required leekslazylogger and created a new Logger instance as shown on the [Getting started](/geting-started) page.

**Don't create another Logger instance in this process - use ChildLoggers.**

To use the Logger in another file (eg. `utils.js`) you could use a ChildLogger, or you could pass `log`.

## Option 1

**Using a ChildLogger**

Pass the `log` object to the `log.multi()` function once, then create ChildLoggers in your other files.

```js
// index.js
log.multi(log);
```

```js
// another file (eg. utils.js)
const { ChildLogger } = require('leekslazylogger');
const log = new ChildLogger(); // no options, inherits from main
```

## Option 2

**Passing the `log` object**

Simple, just use the same `log` object in every file.

```js
// index.js
const utils = require('./utils.js');
utils.myFunction(log, ...);
```
