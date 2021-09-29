/**
 * @module leekslazylogger
 * @author eartharoid <contact@eartharoid.me>
 * @description An easy-to-use and lightweight logger for Node.js with colours, timestamps, and files.
 * @copyright 2021 Isaac Saunders (eartharoid)
 * @license MIT
 */

'use strict';

import {
	CompleteLoggerOptions,
	LogContent,
	LoggerOptions,
	LogLevel,
	LogLevelType
} from './types';

import merge from '@eartharoid/deep-merge';
import defaults from './defaults';
import { inspect } from 'util';
import * as transports from './transports';

module.exports = class Logger {
	public defaults: CompleteLoggerOptions;
	private _options: CompleteLoggerOptions;
	public levels: Array<string>;

	constructor(options: LoggerOptions = {}) {
		this.defaults = defaults;
		this._options = merge(this.defaults, options);
		this.levels = Object.keys(this._options.levels);
		this._init();
	}

	private _init() {
		this.levels = Object.keys(this._options.levels);

		if (this._options.transports.length < 1) throw new Error('At least one logger transport is required. Remove `transports` from your options to use the defaults.');

		for (const level in this._options.levels) {
			const log_level: LogLevel = {
				name: level,
				number: this.levels.indexOf(level),
				type: <LogLevelType>this._options.levels[level]
			};
			this[level] = (...content: LogContent) => this.log(null, log_level, ...content);

			for (const namespace of this._options.namespaces) {
				this[level][namespace] = (...content: LogContent) => this.log(namespace, log_level, ...content);
			}
		}
	}

	public log(namespace: string | null, level: LogLevel, ...content: LogContent) {
		const strings = content.map((c: unknown) => typeof c === 'string'
			? c
			: c instanceof Error
				? c.stack
				: typeof c === 'object'
					? inspect(c)
					: String(c));

		for (const transport of this._options.transports) {
			if (level.number >= this.levels.indexOf(transport.level)) {
				transport.write({
					content: strings.join(' '),
					level,
					namespace,
					timestamp: new Date()
				});
			}

		}
	}

	get options() {
		return this._options;
	}

	set options(options) {
		this._options = options;
		this._init();
	}
};

module.exports.transports = transports;