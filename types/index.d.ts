import {
	LogContent,
	LogLevel,
	LoggerOptions,
	Partial
} from '../src/types';

declare module 'leekslazylogger' {
	export class Logger {
		public defaults: LoggerOptions;
		public levels: Array<string>;

		constructor(options?: Partial<LoggerOptions>);

		public log(namespace: string | null, level: LogLevel, ...content: LogContent): void;
		public get options(): Partial<LoggerOptions>;
		public set options(options: Partial<LoggerOptions>);

		public debug(...content: LogContent): void;
		public verbose(...content: LogContent): void;
		public info(...content: LogContent): void;
		public success(...content: LogContent): void;
		public warn(...content: LogContent): void;
		public notice(...content: LogContent): void;
		public error(...content: LogContent): void;
		public critical(...content: LogContent): void;
	}
}
