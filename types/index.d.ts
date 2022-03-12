import {
	CompleteLoggerOptions,
	LogContent,
	LogLevel,
	PartialLoggerOptions
} from '../src/types';

import {
	ConsoleTransport,
	FileTransport
} from '../src/transports';

declare module 'leekslazylogger' {
	export default class Logger {
		public defaults: CompleteLoggerOptions;
		public levels: Array<string>;

		constructor(options?: PartialLoggerOptions);

		public log(namespace: string | null, level: LogLevel, ...content: LogContent): void;
		public get options(): PartialLoggerOptions;
		public set options(options: PartialLoggerOptions);

		public debug(...content: LogContent): void;
		public verbose(...content: LogContent): void;
		public info(...content: LogContent): void;
		public success(...content: LogContent): void;
		public warn(...content: LogContent): void;
		public notice(...content: LogContent): void;
		public error(...content: LogContent): void;
		public critical(...content: LogContent): void;

		static get transports(): {
			ConsoleTransport: ConsoleTransport,
			FileTransport: FileTransport
		};
	}
}
