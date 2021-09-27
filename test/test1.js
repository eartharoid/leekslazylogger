const Logger = require('../dist');
const {
	ConsoleTransport,
	FileTransport
} = require('../dist/transports');

const log = new Logger({
	name: 'leekslazylogger test 1',
	timestamp: 'HH:mm:ss',
	transports: [
		new ConsoleTransport({
			levels: {
				_logger: '[{timestamp}] [LOGGER] {text}',
				critical: '[{timestamp}] [CRITICAL] {text}',
				debug: '[{timestamp}] [DEBUG] {text}',
				error: '[{timestamp}] [ERROR] {text}',
				info: '[{timestamp}] [INFO] {text}',
				notice: '[{timestamp}] [NOTICE] {text}',
				success: '[{timestamp}] [SUCCESS] {text}',
				warn: '[{timestamp}] [WARN] {text}'
			}
		}),
		new FileTransport({
			clean_directory: 7,
			directory: './logs',
			file: 'YYYY-MM-DD.err.log',
			levels: {
				critical: data => JSON.stringify(data),
				error: data => JSON.stringify(data),
				notice: data => JSON.stringify(data),
				warn: data => JSON.stringify(data)
			},
			new_file: 'day' // or 'run'
		})
	]
});

log.info('text');

/*
 * {
 * content: data.content,
 * level: data.level,
 * timestamp: data.timestamp // this is a Date object, not the same as `{timestamp}`
 * }
 */
