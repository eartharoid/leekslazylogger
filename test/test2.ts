import Logger from '../dist';
const { FileTransport } = require('../dist/transports');

const log = new Logger({
	transports: [
		new Logger.transports.ConsoleTransport({
			format: '[{timestamp}] [{level}] ({file}:{line}:{column}): {content}',
			level: 'debug',
			timestamp: 'HH:mm:ss',
		}),
		new FileTransport({
			clean_directory: 0,
			file: 'YY-MM-DD-HH-mm-ss.log',
			level: 'warn',
			name: 'Test 2',
			new_file: 'run',
		})
	],
});

for (const level in log.options.levels) log[level](`Hello world, I'm ${level}!`);

