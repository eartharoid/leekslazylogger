import {
	FileTransportOptions,
	Log
} from '../../types';

import DTF from '@eartharoid/dtf';

const dtf = new DTF('en-GB');
const { version } = require('../../../package.json');
const defaults: FileTransportOptions = {
	clean_directory: 7,
	directory: './logs',
	file: 'YYYY-MM-DD.log',
	format: function (this: FileTransportOptions, log: Log): string {
		const timestamp = typeof this.timestamp === 'function' ? this.timestamp(log.timestamp) : dtf.fill(this.timestamp, log.timestamp);
		return `[${timestamp}] [${log.level.name.toUpperCase()}] ${log.namespace ? `(${log.namespace.toUpperCase()}) ` : ''}${log.content}`;
	},
	header: function (this: FileTransportOptions): string {
		const datetime = dtf.fill('DDDD, DD MMMM YYYY at HH:mm AMPM');
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		return `\r\n\t❯ ${this.name}\r\n\t❯ Powered by leekslazylogger v${version}\r\n\t❯ Log level "${this.level}"\r\n\t❯ Node.js ${process.version} on ${process.platform}\r\n\t❯ ${datetime} (${timezone}) -->\r\n`;
	},
	level: 'info',
	name: 'A leekslazylogger project',
	new_file: 'day',
	timestamp: 'DD/MM/YY HH:mm:ss',
};

export default defaults;