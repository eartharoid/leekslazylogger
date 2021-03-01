declare module 'leekslazylogger' {

	interface LogLevel {
		type?: 'log' | 'info' | 'debug' | 'warn' | 'error',
		format: string
	}

	interface LoggerOptions {
		name?: string,
		logToFile?: boolean,
		header?: boolean,
		format?: object,
		timestamp?: string,
		maxAge?: number,
		keepSilent?: boolean,
		debug?: boolean,
		daily?: boolean,
		directory?: string,
		levels: object<LogLevel>
	}

	/**
	 * @description Logger object with options
	 * @param {LoggerOptions} options - customise your logger with options
	 */
	export default class Logger {
		constructor(options?: LoggerOptions);
	}
}
