/**
 * @module leekslazylogger
 * @author eartharoid <contact@eartharoid.me>
 * @description An easy-to-use and lightweight Node.JS logger with file support, colours, and timestamps.
 * @copyright 2021 Isaac Saunders (eartharoid)
 * @license MIT
 */

'use strict';

import { LoggerOptions } from './types';

import merge from '@eartharoid/deep-merge';
import defaults from './defaults';

module.exports = class Logger {
	public defaults: LoggerOptions;
	private _options: LoggerOptions;

	constructor(options = {}) {
		this.defaults = defaults;
		this._options = merge(this.defaults, options);
		this._init();
	}

	_init() {
		if (this._options.transports.length < 1) throw new Error('At least one logger transport is required. Remove `transports` from your options to use the defaults.');

		for (const level of this._options.levels) {
			/*
			 * log.info.commands
			 * log.error.commands
			 */

			// ...content

			// content.join(' ')

			// { timestamp, level, log }
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