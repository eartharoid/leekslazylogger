# Customisation

Options can be set on initialisation, but are not required.
You can also use the `options` setter to set options after initialisation.
The object will be merged deeply with the existing (or default) options.

```js
log.error.http('this will throw an error');
log.options = {
	// in this example only `namespaces` is modified,
	// so `levels` and `transports` are preserved from existing/default options
	namespaces: ['http']
};
log.success.http('this works');
```

## Logger options

??? summary "Defaults"
	See [defaults.ts](https://github.com/eartharoid/leekslazylogger/blob/main/src/defaults.ts)


Types:

```ts
interface Partial<LoggerOptions> {
	levels?: {
		[name: string]: string
	},
	namespaces?: Array<string>,
	transports?: Array<Transport>
}
```
### `levels`

??? summary "Default"
	```js
	levels: {
		debug: 'info',
		verbose: 'info',
		info: 'info',
		success: 'info',
		warn: 'warn',
		notice: 'warn',
		error: 'error',
		critical: 'error'
	}
	```

You shouldn't need to change these. If you do, you're probably using levels incorrectly and you should look at [namespaces](#namespaces).

### `namespaces`

??? summary "Default"
	```js
	namespaces: []
	```

Use namespaces to separate your logs into to logical areas (eg. `log.info.exampleNamespace()`)

### `transports`

??? summary "Default"
	```js
	transports: [
		new ConsoleTransport(),
		new FileTransport()
	]
	```

Transports are where the heavy lifting is done. When you use a log function, a log object is passed to the write function of each transport with a matching log level.

- Customise [ConsoleTransport](../transports/built-in/console)
- Customise [FileTransport](../transports/built-in/file)
- [Browse community transports](../transports/community)
- [Make your own transport](../transports/creating-a-transport)