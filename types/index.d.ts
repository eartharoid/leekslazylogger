import { LoggerOptions } from '../src/types';

declare module 'leekslazylogger' {
	export default class Logger {
		constructor(options: LoggerOptions);
		public get options(): LoggerOptions;
		public set options(options: LoggerOptions);
	}
}
