declare module 'leekslazylogger' {

	interface LogLevel {
		type?: 'log' | 'info' | 'debug' | 'warn' | 'error',
		format: string
	}

	interface LoggerOptions {
		name?: string,
		logToFile?: boolean,
		header?: boolean,
		format?: Object,
		timestamp?: string,
		maxAge?: number,
		keepSilent?: boolean,
		debug?: boolean,
		daily?: boolean,
		directory?: string,
		levels: Object<LogLevel>
	}

	/**
	 * @description Logger object with options
	 * @param {LoggerOptions} options - customise your logger with options
	 */
	export default class Logger {
		constructor(options?: LoggerOptions);
	}
}