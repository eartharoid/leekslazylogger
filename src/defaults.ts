/* eslint-disable sort-keys */

import { LoggerOptions } from './types';

import ConsoleTransport from './transports/console';
import FileTransport from './transports/file';

const defaults: LoggerOptions = {
	levels: {
		debug: 'info',
		verbose: 'info',
		info: 'info',
		success: 'info',
		warn: 'warn',
		notice: 'warn',
		error: 'error',
		critical: 'error',
	},
	namespaces: [],
	transports: [
		new ConsoleTransport(),
		new FileTransport()
	],
};
export default defaults;

