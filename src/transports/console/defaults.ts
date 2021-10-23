import {
	CompleteConsoleTransportOptions,
	Log
} from '../../types';

import { short } from 'leeks.js';
import DTF from '@eartharoid/dtf';

const dtf = new DTF('en-GB');
const defaults: CompleteConsoleTransportOptions = {
	colours: {
		critical: '&!4&0',
		debug: '&1',
		error: '&4',
		info: '&3',
		notice: '&!6&0',
		success: '&2',
		warn: '&6'
	},
	format: function (this: CompleteConsoleTransportOptions, log: Log): string {
		const timestamp = typeof this.timestamp === 'function' ? this.timestamp(log.timestamp) : dtf.fill(this.timestamp, log.timestamp);
		const colour = this.colours[log.level.name] ?? '';
		return short(`${colour}[${timestamp}] [${log.level.name.toUpperCase()}] ${log.namespace ? `(${log.namespace.toUpperCase()}) ` : ''}${log.content}`);
	},
	level: 'info',
	timestamp: 'DD/MM/YY HH:mm:ss'
};

export default defaults;