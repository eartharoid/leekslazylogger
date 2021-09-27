export interface LogLevel {
	name: string,
	type: 'debug' | 'info' | 'warn' | 'error'
}

export interface LoggerOptions {
	levels: Array<LogLevel>,
	name: string,
	namespaces: Array<string>,
	timestamp: string | ((date: Date) => string),
	transports: Array<unknown>
}

export interface Log {
	namespace?: string,
	level: string,
	content: string
	timestamp: Date
}