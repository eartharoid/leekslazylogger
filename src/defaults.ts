import {
	Log,
	LoggerOptions
} from './types';

import {
	ConsoleTransport,
	FileTransport
} from './transports';

import DTF from '@eartharoid/dtf';

const dtf = new DTF('en-GB');
const { version } = require('../package.json');
const colours = {
	critical: '&!4&0',
	debug: '&1',
	error: '&4',
	info: '&3',
	notice: '&!6&0',
	success: '&2',
	warn: '&6'
};

const defaults: LoggerOptions = {
	levels: [
		{
			name: 'debug',
			type: 'info'
		},
		{
			name: 'verbose',
			type: 'info'
		},
		{
			name: 'info',
			type: 'info'
		},
		{
			name: 'success',
			type: 'info'
		},
		{
			name: 'warn',
			type: 'warn'
		},
		{
			name: 'notice',
			type: 'warn'
		},
		{
			name: 'error',
			type: 'error'
		},
		{
			name: 'critical',
			type: 'error'
		}
	],
	name: 'A leekslazylogger project',
	namespaces: [],
	timestamp: 'DD/MM/YY HH:mm:ss',
	transports: [
		new ConsoleTransport({
			format: (log: Log, logger: LoggerOptions): string => {
				const timestamp = typeof logger.timestamp === 'function' ? logger.timestamp(log.timestamp) : dtf.fill(logger.timestamp, log.timestamp);
				const colour = colours[log.level] ?? '';
				return `${colour}[${timestamp}] [${log.level.toUpperCase()}] ${log.namespace ? `(${log.namespace.toUpperCase()}) ` : ''}${log.content}`;
			},
			level: 'info'
		}),
		new FileTransport({
			clean_directory: 7,
			directory: './logs',
			file: 'YYYY-MM-DD.log',
			format: (log: Log, logger: LoggerOptions): string => {
				const timestamp = typeof logger.timestamp === 'function' ? logger.timestamp(log.timestamp) : dtf.fill(logger.timestamp, log.timestamp);
				return `[${timestamp}] [${log.level.toUpperCase()}] ${log.namespace ? `(${log.namespace.toUpperCase()}) ` : ''}${log.content}`;
			},
			header: (logger: LoggerOptions, transport) => {
				const datetime = dtf.fill('DDDD, DD MMMM YYYY at HH:mm AMPM');
				const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
				return `\r\n\t❯ ${logger.name}\r\n\t❯ Powered by leekslazylogger v${version}\r\n\t❯ Node.js ${process.version} on ${process.platform}\r\n\t❯ Log level "${transport.level}"\r\n\t❯ ${datetime} (${timezone}) -->\r\n`;
			},
			level: 'info',
			new_file: 'day' // or 'run'
		})
	]
};
export default defaults;


