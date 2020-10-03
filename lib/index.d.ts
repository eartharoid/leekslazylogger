declare module 'leekslazylogger' {

	interface CustomType {
		type: string,
		title: string,
		foreground: string|number,
		background: string|number
	}

	interface LoggerOptions {
		name: string,
		logToFile: boolean,
		timestamp: string,
		maxAge: number,
		keepSilent: boolean,
		debug: boolean,
		custom: Object<CustomType>
	}

	/**
	 * @description Logger object with options (o)
	 * @param {LoggerOptions} options - customise your logger with options
	 */
	export default class Logger {
		constructor(options?: LoggerOptions);
	}

	/**
	 * @description Deprecated
	 * @deprecated Read the docs: logger.eartharoid.me
	 */
	export const init: (o?: Object) => void;
}