import {
	CompleteLoggerOptions,
	LogContent,
	LogLevel,
	LoggerOptions
} from '../src/types';

declare module 'leekslazylogger' {
	export default class Logger {
		public defaults: CompleteLoggerOptions;
		public levels: Array<string>;

		constructor(options: LoggerOptions);

		public log(namespace: string | null, level: LogLevel, ...content: LogContent): void;
		public get options(): LoggerOptions;
		public set options(options: LoggerOptions);
	}
}
