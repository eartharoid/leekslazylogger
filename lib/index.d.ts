declare module 'leekslazylogger' {

	interface LogLevel {
		type?: 'log' | 'info' | 'debug' | 'warn' | 'error',
		format: string | function
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
		levels?: {
			[level: string]: LogLevel
		}
	}

	let options: LoggerOptions;
	export default class Logger {
		public options: LoggerOptions;
		public ext: Array;

		/**
		 * @description Create a new Logger
		 * @param {LoggerOptions} o - customise your logger with options
		 */
		constructor(o?: LoggerOptions) {
			options = o;
		};
		
		/**
		 * @description 
		 * @param {any} text - the content to log, a string or anything that can be stringified
		 * @param {any} [colour] - colours
		 * @param {any} [args] - stuff to add on the end, won't be formatted
		 */
		public [level in options.levels]: (text: any, colour: any, ...args: any) => void;

		public timestamp(): string;

		public register(name: string, o: any): void;

		private verbose(text: string): void;

		private clearOldFiles(callback: function): void;

		private prepareFile(): void;

		private writeLine(type: string, str: string, ...args: any): void;

		get baseFileName(): string;

		get stdoutPath(): string;

		get stderrPath(): string;

		public static format(str: string): string;

		public static f(str: string): string;
	}
}
