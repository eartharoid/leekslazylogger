/* eslint-disable sort-keys */

import { CompleteLoggerOptions } from './types';

import {
	ConsoleTransport,
	FileTransport
} from './transports';

const defaults: CompleteLoggerOptions = {
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

