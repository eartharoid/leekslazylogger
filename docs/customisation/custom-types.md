# Custom log types

To create custom log types, pass a `custom` object of types with the [options](../options)

!!! example

	```js
	const log = new Loger({
		custom: {
		sql: {
			title: 'MySQL',
			foreground: 'bluebright',
			type: 'info'
		},
		redis: {
			title: 'Redis',
			foreground: 'redBright',
			type: 'info'
		},
	},
	});
	```

If you created a type called `sql` like this:

```js
custom: {
	sql: {
		title: 'MySQL',
		foreground: 'bluebright',
		type: 'info'
	},
},
```

You would use it like this:

```js
log.sql('Something about the database');
// -> [00:00:00 | MYSQL] Something about the database
```

## Options

### title

A string that will show with the timestamp (it will be logged in uppercase)

### foreground

A resolvable foreground [colour](/colours) to colour the text.

### background

A resolvable background [colour](/colours) to colour the background.

### type

Changes the `console` function. Defaults to `info`

