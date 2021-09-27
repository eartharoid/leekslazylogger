import { LoggerOptions } from '../src/types';

declare module 'leekslazylogger' {
	export default class Logger {
		constructor(options: LoggerOptions);
		get options(): LoggerOptions;
		set options(options: LoggerOptions);
	}
}
