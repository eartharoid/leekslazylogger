import Transport from './transport';

export type LogLevelType = 'debug' | 'info' | 'warn' | 'error';

export interface LogLevel {
	name: string,
	number: number,
	type: LogLevelType
}

export interface LoggerOptions {
	levels?: {
		[name: string]: string
	},
	namespaces?: Array<string>,
	transports?: Array<Transport>
}

export interface CompleteLoggerOptions {
	levels: {
		[name: string]: string
	},
	namespaces: Array<string>,
	transports: Array<Transport>
}

export type LogContent = Array<unknown>;

export interface Log {
	content: string,
	level: LogLevel,
	namespace: string | null,
	timestamp: Date
}

export interface TransportOptions {
	level: string,
}

export interface ConsoleTransportOptions {
	format?: string | ((this: CompleteConsoleTransportOptions, log: Log) => string),
	level?: string,
	timestamp?: string | ((date: Date) => string)
}

export interface CompleteConsoleTransportOptions {
	format: string | ((this: CompleteConsoleTransportOptions, log: Log) => string),
	level: string,
	timestamp: string | ((date: Date) => string)
}

export interface FileTransportOptions {
	clean_directory?: number
	directory?: string
	file?: string | (() => string),
	format?: string | ((this: CompleteFileTransportOptions, log: Log) => string),
	header?: string | ((this: CompleteFileTransportOptions) => string),
	level?: string,
	name?: string,
	new_file?: 'day' | 'run',
	timestamp?: string | ((date: Date) => string)
}

export interface CompleteFileTransportOptions {
	clean_directory: number
	directory: string
	file: string | (() => string),
	format: string | ((this: CompleteFileTransportOptions, log: Log) => string),
	header: string | ((this: CompleteFileTransportOptions) => string),
	level: string,
	name: string,
	new_file: 'day' | 'run',
	timestamp: string | ((date: Date) => string)
}