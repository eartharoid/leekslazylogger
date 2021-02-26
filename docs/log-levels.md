# Default log levels

These are the default levels. They can be overridden by passing [options](/customisation), which also allows adding more.

??? summary "_logger"
	## \_logger

	The log level used by the logger for startup messages.

	**Default format:** `[{timestamp} | LOGGER] {text}`

??? summary "basic"
	## basic

	A basic format with just the timestamp and text.

	**Default format:** `[{timestamp}] {text}`

??? summary "console"
	## console

	The standard format for all your logging needs.

	**Default format:** `[{timestamp} | INFO] {text}`

??? summary "info"
	## info

	Add some colour to your informative log messages with this cyan-coloured format.

	**Default format:** `&3[{timestamp} | INFO] {text}`

??? summary "success"
	## success

	Celebrate success with this green-coloured format.

	**Default format:** `&2[{timestamp} | INFO] {text}`

??? summary "debug"
	## debug

	This log level uses `console.debug`, which is automatically suppressed unless the `debug` option is set to `true`. When you encounter a bug, spam your logs with this dark blue-coloured format.

	**Default format:** `&1[{timestamp} | DEBUG] {text}`

??? summary "notice"
	## notice

	Get the users attention with this black-on-yellow-coloured format which stands easily out.

	**Default format:** `&0&!6[{timestamp} | NOTICE] {text}`

??? summary "warn"
	## warn

	Display warnings with this yellow-coloured format.

	**Default format:** `&6[{timestamp} | WARN] {text}`

??? summary "error"
	## error

	Display errors with this scary red-coloured format.

	**Default format:** `&4[{timestamp} | ERROR] {text}`
