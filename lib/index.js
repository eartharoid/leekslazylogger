/**
 * @module leekslazylogger
 * @author eartharoid <contact@eartharoid.me>
 * @description An easy-to-use and lightweight Node.JS logger with file support, colours, and timestamps.
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license MIT
 */

const dtf = require('@eartharoid/dtf'); // for the timestamp & file name
const leeks = require('leeks.js'); // like chalk, terminal colours & styles
const pkg = require('../package.json'); // for version and author info etc
const fs = require('fs'); // if you don't know what this is you shouldn't be reading this
const data = require('./data'); // colour codes, defaults etc
const {
	join,
	resolve
} = require('path');
const merge = require('lodash.merge');

const {
	plural,
	replaceCodes,
	strip,
	colourType,
	bgColourType,
	capitalise
} = require('./utils');

class LoggerError extends Error {
	constructor(message) {
		console.log(leeks.colours.yellow(`[LOGGER] Logger error thrown; perhaps you should read the documentation at ${pkg.homepage} ..?`));
		super(message);
	}
}

/** The Logger */
class Logger {
	/**
	 * @description Create a new Logger
	 * @param {object} o - customise your logger with this.options
	 * @param {string} o.name - name of your project, will appear at the top of log files
	 * @param {boolean} o.logToFile - log everything to a file?
	 * @param {boolean} o.daily - Make a new file at the start of every day?
	 * @param {boolean} o.keepSilent - Hide startup messages from the logger?
	 * @param {string} o.timestamp - timestamp format
	 * @param {number} o.maxAge - number of days to keep old log files (-1 to delete all)
	 * @param {object} o.custom - object of custom types, see wiki for help
	 */
	constructor(o) {
		this.options = data.defaults;
		this.ext = {};

		if (o) {
			if (typeof o !== 'object') throw new TypeError('Logger options must be an object');
			Object.assign(this.options, o);
			merge(this.options.types, this.options.custom); // deep merge
		}

		for (let type in this.options.types) {
			this[type] = (text, colour) => {
				let t = this.options.types[type],
					title = t.title ? ` | ${t.title.trim().toUpperCase()}` : '',
					timestamp = `[${this.timestamp() + title}] `,
					prefix = t.prefix ? `[${t.prefix.trim().toUpperCase()}] ` : '';

				if (!t.type) t.type = 'info';
				t.type = t.type.trim().toLowerCase();

				if ((t.type === 'debug' && this.options.debug === false) || !text) return;

				try {
					if (typeof text !== 'string') {
						if (text instanceof Error) text = text.stack; // stringify errors
						else text = JSON.stringify(text, null, 2); // stringify objects
					}
				} catch (e) {
					// do nothing
				}

				if (!text) return; // stop here if no text was provided

				if (leeks.supportsColour) {
					let fg = colour ? colour[0] : t.foreground, // colour values
						bg = colour ? colour[1] : t.background,
						fgt = 'colours', // colour types
						bgt = 'colours';

					if (fg) fgt = colourType(fg);

					if (bg) {
						bgt = bgColourType(bg);

						if (bgt === 'colours' && !bg.startsWith('bg'))
							bg = 'bg' + bg[0].toUpperCase() + bg.substring(1); // convert FG colour name to BG
						else if (bgt === 'CODE') {
							bgt = 'colours';
							if (bg[1] !== '!') bg = '&!' + bg[1]; // convert FG code to BG
							if (!data.codes[bg]) throw new LoggerError('Unknown colour code');
							bg = data.codes[bg][1]; // get leeks colour name
						} else if (bgt === 'rgb') bg = bg.replace(' ', '').split(','); // convert to array
					}

					if (fgt === 'CODE') {
						fgt = 'colours';
						if (!data.codes[fg]) throw new LoggerError('Unknown colour code');
						fg = data.codes[fg][1]; // get leeks colour name
					} else if (fgt === 'rgb') fg = fg.replace(' ', '').split(','); // convert to array

					let bgf = !bg
						? timestamp + prefix + text // no background colour
						: bgt === 'colours'
							? leeks[bgt][bg](timestamp + prefix + text) // standard colour name
							: leeks[bgt](bg, timestamp + prefix + text); // other colour type

					if (!fg) console[t.type](bgf);
					else console[t.type](fgt === 'colours' ? leeks[fgt][fg](bgf) : leeks[fgt](fg, bgf));

				} else console[t.type](timestamp + strip(text)); // for weirdos who don't like colours

				// append line to log file
				if (this.options.logToFile) this.writeLine(timestamp + prefix + strip(text) + '\n');
			};

		}

		this.verbose(`[${this.timestamp()} | LOGGER] Initialising logger (v${pkg.version})`);

		if (this.options.logToFile === true) {
			
			if (this.options.daily === false) this.path = join(this.options.directory, `/${dtf('YYYY-MM-DD-HH-mm-ss')}.log`); // 1 per run
			else this.path = join(this.options.directory, `/${dtf('YYYY-MM-DD')}.log`); // 1 per day

			this.createNewFile();

		} else this.verbose(`[${this.timestamp()} | LOGGER] Logging to file is ${leeks.colours.redBright('disabled')}`);

		let custom = this.options.types.length - data.defaults.types.length;
		if (this.options.types.length > data.defaults.types.length) this.verbose(`[${this.timestamp()} | LOGGER] Initialised with ${custom} custom log ${plural('type', custom)}`);

	}

	/**
	 * @description Returns timestamp
	 * @returns {string} timestamp
	 */
	timestamp() {
		return typeof this.options.timestamp === 'function'
			? this.options.timestamp()
			: dtf(this.options.timestamp);
	}

	/**
	 * @description Format a string to add colour with '&' short-codes
	 * @param {string} String to format
	 * @returns {string} Formatted text
	 */
	static format(str) {
		return replaceCodes(str);
	}

	/**
	 * @description Format a string to add colour with '&' short-codes
	 * @param {string} String to format
	 * @returns {string} Formatted text
	 */
	static f(str) {
		return replaceCodes(str);
	}

	/**
	 * @description Format a string to add colour with '&' short-codes
	 * @param {string} String to format
	 * @returns {string} Formatted text
	 * @deprecated Use the static method instead - **THIS WILL BE REMOVED IN THE NEXT VERSION**
	 */
	format(str) {
		return replaceCodes(str);
	}

	/**
	 * @description Format a string to add colour with '&' short-codes
	 * @param {string} String to format
	 * @returns {string} Formatted text
	 * @deprecated Use the static method instead - **THIS WILL BE REMOVED IN THE NEXT VERSION**
	 */
	f(str) {
		return replaceCodes(str);
	}

	verbose(text) {
		if (!this.options.keepSilent) return console.log(text);
	}

	clearOldFiles(callback) {
		const one_day = 1000 * 60 * 60 * 24;
		// delete any log files older than this.options.maxAge days
		const files = fs.readdirSync(resolve(this.options.directory)).filter(file => file.endsWith('.log'));
		let logs = 0;
		let today = new Date();
		for (const file of files) { // cycle through each file
			let lastMod = new Date(fs.statSync(join(this.options.directory, `/${file}`)).mtime);
			if (Math.floor((today - lastMod) / one_day) > this.options.maxAge) { // check
				fs.unlinkSync(join(this.options.directory, `/${file}`)); // delete
				logs++;
			}
		}
		callback(logs);
	}

	createNewFile() {
		if (!fs.existsSync(resolve(this.options.directory))) { // create logs folder if it doesn't exist
			fs.mkdirSync(resolve(this.options.directory));
			this.verbose(this.options.keepSilent, `[${dtf(this.options.timestamp)} | LOGGER] No logs directory found, creating one for you`);
		}
		this.clearOldFiles(logs => {
			if (logs >= 1) this.verbose(`[${dtf(this.options.timestamp)} | LOGGER] Deleted ${logs} old log ${plural('file', logs)}`);
		}); // delete old files
		this.verbose(`[${dtf(this.options.timestamp)} | LOGGER] Preparing log file ("${this.path}")`);
		fs.appendFileSync(this.path, require('./header')(this.options));
	}

	writeLine(str) {
		if (this.options.daily) {
			let prev = join(this.options.directory, `/${dtf('YYYY-MM-DD')}.log`);
			if (this.path !== prev) {
				this.path = prev;
				this.createNewFile();
			}
		}
		fs.appendFileSync(this.path, str);
	}

	get defaults() {
		return data.defaults;
	}

	register(name, o) {
		if (!this.ext[name]) {
			this.verbose(`[${this.timestamp()} | LOGGER] ${capitalise(name)} extension enabled`);
			this.ext[name] = true;
		}
			
		this.options[name] = o;
	}
}

module.exports = Logger;