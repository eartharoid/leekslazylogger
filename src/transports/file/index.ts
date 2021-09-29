import {
	CompleteFileTransportOptions,
	FileTransportOptions,
	Log
} from '../../types';

import Transport from '../../transport';
import merge from '@eartharoid/deep-merge';
import defaults from './defaults';
import { Console } from 'console';
import DTF from '@eartharoid/dtf';
import fs from 'fs';
import {
	join,
	resolve
} from 'path';

const dtf = new DTF('en-GB');

export default class FileTransport extends Transport {
	public options: CompleteFileTransportOptions;
	private console;
	private today;
	private stream;

	constructor(options: FileTransportOptions = {}) {
		const merged: CompleteFileTransportOptions = merge(defaults, options);
		super({ level: merged.level });
		this.options = merged;
		this._prepareFile();
	}

	private _prepareFile() {
		this.today = dtf.fill('YYYY-MM-DD');

		if (!fs.existsSync(resolve(this.options.directory))) {
			fs.mkdirSync(resolve(this.options.directory));
		}

		if (this.options.clean_directory > 0) {
			const one_day = 1000 * 60 * 60 * 24;
			const files = fs.readdirSync(resolve(this.options.directory)).filter(file => file.endsWith('.log'));
			const date = Date.now();
			for (const file of files) {
				const path = join(this.options.directory, `/${file}`);
				const last_mod = new Date(fs.statSync(path).mtime).valueOf();
				const old = Math.floor((date - last_mod) / one_day) > this.options.clean_directory;
				if (old) fs.unlinkSync(path);
			}
		}

		if (this.stream) this.stream.end();

		const file = typeof this.options.file === 'function' ? this.options.file() : dtf.fill(this.options.file);
		const path = join(resolve(this.options.directory), file);
		this.stream = fs.createWriteStream(path, { flags: 'a' }); // 'a' flag to append instead of overwriting
		this.console = new Console({
			stderr: this.stream,
			stdout: this.stream
		});
		const header = typeof this.options.header === 'function' ? this.options.header.call(this.options) : this.options.header;
		this.console.log(header);
	}

	write(log: Log): void {
		if (this.options.new_file.toLowerCase() === 'day' && this.today !== dtf.fill('YYYY-MM-DD')) this._prepareFile();

		const content = typeof this.options.format === 'function'
			? this.options.format.call(this.options, log)
			: this.options.format
				.replace(/{+ ?level ?}+/gm, log.level.name.toLowerCase())
				.replace(/{+ ?LEVEL ?}+/gm, log.level.name.toUpperCase())
				.replace(/{+ ?namespace ?}+/gm, log.namespace?.toLowerCase() ?? 'global')
				.replace(/{+ ?NAMESPACE ?}+/gm, log.namespace?.toUpperCase() ?? 'GLOBAL')
				.replace(/{+ ?content ?}+/gmi, log.content)
				.replace(/{+ ?timestamp ?}+/gmi, typeof this.options.timestamp === 'function'
					? this.options.timestamp(log.timestamp)
					: dtf.fill(this.options.timestamp, log.timestamp));
		this.console[log.level.type](content);
	}
}