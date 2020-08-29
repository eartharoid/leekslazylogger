# Express middleware

## Installation

`npm i leekslazylogger-express`

## Usage

```js
// set up logger with options
const Logger = require('leekslazylogger');
const log = new Logger({
	name: 'My express server'
});

// require express
const express = require('express');
const app = express();

// use logger middleware
app.use(require('leekslazylogger-express'));

...
// other middleware and router
...

// start server
app.listen(80);
```
