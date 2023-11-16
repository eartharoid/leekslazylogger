import {
	CallSite,
	LoggerOptions,
	LogContent,
	LogFunction,
	LogLevel,
	LogLevelType,
	Partial
} from './types';

import merge from '@eartharoid/deep-merge';
import defaults from './defaults';
import { relative } from 'path';
import { format } from 'util';

export default class Logger {
	public static defaults: LoggerOptions = defaults;
	public levels: Array<string>;
	#options: LoggerOptions;

	constructor(options: Partial<LoggerOptions> = {}) {
		// (this.constructor as typeof Logger)
		this.#options = merge(Logger.defaults, options);
		this.levels = Object.keys(this.#options.levels);
		this.#init();
	}

	#init(): void {
		this.levels = Object.keys(this.#options.levels);

		if (this.#options.transports.length < 1) throw new Error('At least one logger transport is required. Remove `transports` from your options to use the defaults.');

		for (const level in this.#options.levels) {
			const log_level: LogLevel = {
				name: level,
				number: this.levels.indexOf(level),
				type: <LogLevelType>this.#options.levels[level],
			};
			this[level] = (...content: LogContent) => this.log(null, log_level, ...content);

			for (const namespace of this.#options.namespaces) {
				this[level][namespace] = (...content: LogContent) => this.log(namespace, log_level, ...content);
			}
		}
	}

	public log(namespace: string | null, level: LogLevel, ...content: LogContent): void {
		const _prepareStackTrace = Error.prepareStackTrace; // eslint-disable-line no-underscore-dangle
		Error.prepareStackTrace = (_, stack) => stack;
		const stack = <Array<CallSite> | undefined>new Error().stack;
		const callsite = stack ? stack[2] : null;
		Error.prepareStackTrace = _prepareStackTrace;

		for (const transport of this.#options.transports) {
			if (level.number >= this.levels.indexOf(transport.level)) {
				transport.write({
					column: callsite ? callsite.getColumnNumber() : null,
					content: format(...content),
					file: callsite?.getFileName() ? relative(process.cwd(), <string>callsite?.getFileName()) : null,
					level,
					line: callsite ? callsite.getLineNumber() : null,
					namespace,
					timestamp: new Date(),
				});
			}
		}
	}

	get options(): LoggerOptions {
		return this.#options;
	}

	set options(options: Partial<LoggerOptions>) {
		this.#options = merge(this.#options, options);
		this.#init();
	}
}

declare module '.' {
	interface Logger {
		debug: LogFunction
		verbose: LogFunction;
		info: LogFunction;
		success: LogFunction;
		warn: LogFunction;
		notice: LogFunction;
		error: LogFunction;
		critical: LogFunction;
	}
}