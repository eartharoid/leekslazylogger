import Transport from './Transport';

export interface CallSite {
	getThis(): unknown | undefined;
	getTypeName(): string | null;
	getFunction(): (...args: unknown[]) => unknown | undefined;
	getFunctionName(): string | null;
	getMethodName(): string | undefined;
	getFileName(): string | null;
	getLineNumber(): number | null;
	getColumnNumber(): number | null;
	getEvalOrigin(): string | undefined;
	isToplevel(): boolean;
	isEval(): boolean;
	isNative(): boolean;
	isConstructor(): boolean;
}

export interface ConsoleTransportOptions {
	colours: {
		[level: string]: string
	},
	format: string | ((this: ConsoleTransportOptions, log: Log) => string),
	level: string,
	timestamp: string | ((date: Date) => string)
}

export interface FileTransportOptions {
	clean_directory: number
	directory: string
	file: string | (() => string),
	format: string | ((this: FileTransportOptions, log: Log) => string),
	header: string | ((this: FileTransportOptions) => string),
	level: string,
	name: string,
	new_file: 'day' | 'run',
	timestamp: string | ((date: Date) => string)
}

export interface Log {
	column: number | null,
	content: string,
	file: string | null,
	level: LogLevel,
	line: number | null,
	namespace: string | null,
	timestamp: Date
}

export type LogContent = Array<unknown>;

export type LogFunction = {
	(...content: LogContent): void;
	[namespace: string]: (...content: LogContent) => void;
};

export interface LogLevel {
	name: string,
	number: number,
	type: LogLevelType
}

export type LogLevelType = 'debug' | 'info' | 'warn' | 'error';

export interface LoggerOptions {
	levels: {
		[name: string]: string
	},
	namespaces: Array<string>,
	transports: Array<Transport>
}

export type Partial<T> = {
	[P in keyof T]?: T[P];
};

export interface TransportOptions {
	level: string,
}