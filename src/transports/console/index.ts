import {
	ConsoleTransportOptions,
	Log,
	Partial
} from '../../types';

import Transport from '../../Transport';
import merge from '@eartharoid/deep-merge';
import defaults from './defaults';
import DTF from '@eartharoid/dtf';
import { short } from 'leeks.js';

const dtf = new DTF('en-GB');

export default class ConsoleTransport extends Transport {
	public options: ConsoleTransportOptions;

	constructor(options: Partial<ConsoleTransportOptions> = {}) {
		const merged: ConsoleTransportOptions = merge(defaults, options);
		super({ level: merged.level });
		this.options = merged;
	}

	write(log: Log): void {
		const content = typeof this.options.format === 'function'
			? this.options.format.call(this.options, log)
			: short(this.options.format)
				.replace(/{+ ?level ?}+/gm, log.level.name.toLowerCase())
				.replace(/{+ ?LEVEL ?}+/gm, log.level.name.toUpperCase())
				.replace(/{+ ?namespace ?}+/gm, log.namespace?.toLowerCase() ?? 'global')
				.replace(/{+ ?NAMESPACE ?}+/gm, log.namespace?.toUpperCase() ?? 'GLOBAL')
				.replace(/{+ ?file ?}+/gmi, log.file ?? 'unknown')
				.replace(/{+ ?line ?}+/gmi, String(log.line) ?? 'unknown')
				.replace(/{+ ?column ?}+/gmi, String(log.column) ?? 'unknown')
				.replace(/{+ ?content ?}+/gmi, log.content)
				.replace(/{+ ?timestamp ?}+/gmi, typeof this.options.timestamp === 'function'
					? this.options.timestamp(log.timestamp)
					: dtf.fill(this.options.timestamp, log.timestamp));
		console[log.level.type](content);
	}
}