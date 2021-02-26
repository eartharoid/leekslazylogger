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
const defaults = require('./defaults'); // default options
const codes = require('./codes'); // short codes
const {
	join,
	resolve
} = require('path');

const {
	plural,
	replaceCodes,
	strip,
	fgColourType,
	bgColourType,
	capitalise,
	deepMerge: merge
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
	 * @param {boolean} o.debug - Log debug messages?
	 * @param {boolean} o.daily - Make a new file at the start of every day?
	 * @param {boolean} o.keepSilent - Hide startup messages from the logger?
	 * @param {string} o.timestamp - timestamp format
	 * @param {number} o.maxAge - number of days to keep old log files (-1 to delete all)
	 * @param {number} o.header - Include header in log files?
	 * @param {object} o.levels - object of custom levels, see docs for help
	 */
	constructor(o) {
		this.options = defaults;
		this.ext = [];

		if (typeof o === 'object') this.options = merge(this.options, o);

		for (let level in this.options.levels) {
			this[level] = (text, colour = [], options = {}) => {
				let l = this.options.levels[level];
				
				if (!l.type) l.type = 'info';
				l.type = l.type.trim().toLowerCase();
				
				if ((l.type === 'debug' && this.options.debug === false)) return;

				if (typeof text !== 'string') {
					try {
						if (text instanceof Error) text = text.stack; // stringify errors
						else if (typeof text === 'object') text = JSON.stringify(text, null, 2); // stringify objects
						else text = String(text);
					} catch {
						text = String(text);
					}
				}

				let fg = colour[0], // foreground colour value
					bg = colour[1], // background colour value
					fgt = 'colours', // foreground colour level
					bgt = 'colours'; // background colour level

				if (bg) {
					bgt = bgColourType(bg);

					if (bgt === 'colours' && !bg.startsWith('bg'))
						bg = 'bg' + bg[0].toUpperCase() + bg.substring(1); // convert FG colour name to BG
					else if (bgt === 'CODE') {
						bgt = 'colours';
						if (bg[1] !== '!') bg = '&!' + bg[1]; // convert FG code to BG
						if (!codes.colours[bg]) throw new LoggerError('Unknown colour code');
						bg = codes.colours[bg]; // get leeks colour name
					} else if (bgt === 'rgb') bg = bg.replace(' ', '').split(','); // convert to array
				}

				if (fg) fgt = fgColourType(fg);
				if (fgt === 'CODE') {
					fgt = 'colours';
					if (!codes.colours[fg]) throw new LoggerError('Unknown colour code');
					fg = codes.colours[fg]; // get leeks colour name
				} else if (fgt === 'rgb') fg = fg.replace(' ', '').split(','); // convert to array

				let bgf = !bg
					? text : bgt === 'colours'
						? leeks[bgt][bg](text) : leeks[bgt](bg, text);

				if (!fg) text = bgf;
				else text = fgt === 'colours'
					? leeks[fgt][fg](bgf) : leeks[fgt](fg, bgf);

				let format = replaceCodes(typeof l.format === 'function' ? l.format() : l.format)
					.replace(/{+ ?timestamp ?}+/gm, this.timestamp())
					.replace(/{+ ?text ?}+/gm, text);

				console[l.type](leeks.supportsColour ? format : strip(format));

				if (this.options.logToFile && options.logToFile !== false)
					this.writeLine(strip(format)); // append line to log file
			};
		}

		this.verbose(`Initialising leekslazylogger (v${pkg.version})`);

		if (this.options.logToFile === true) {		
			if (this.options.daily === false) this.path = join(this.options.directory, `/${dtf('YYYY-MM-DD-HH-mm-ss')}.log`); // 1 per run
			else this.path = join(this.options.directory, `/${dtf('YYYY-MM-DD')}.log`); // 1 per day
			this.prepareFile();	
		} else this.verbose(`Logging to file is ${leeks.colours.redBright('disabled')}`);

		let custom = this.options.levels.length - defaults.levels.length;
		if (this.options.levels.length > defaults.levels.length) this.verbose(`Initialised with ${custom} custom log ${plural('level', custom)}`);

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

	verbose(text) {
		if (!this.options.keepSilent) return this._logger(text, [], {
			logToFile: false
		});
	}

	/** delete any log files older than this.options.maxAge days */
	clearOldFiles(callback) {
		const one_day = 1000 * 60 * 60 * 24;
		const files = fs.readdirSync(resolve(this.options.directory))
			.filter(file => file.endsWith('.log'));
		let logs = 0;
		let today = new Date();
		for (const file of files) {
			let lastMod = new Date(fs.statSync(join(this.options.directory, `/${file}`)).mtime);
			if (Math.floor((today - lastMod) / one_day) > this.options.maxAge) { // check
				fs.unlinkSync(join(this.options.directory, `/${file}`)); // delete
				logs++;
			}
		}
		callback(logs);
	}

	/** Append the header to the log file, creating the file if it doesn't already exist */
	prepareFile() {
		if (!fs.existsSync(resolve(this.options.directory))) { // create logs folder if it doesn't exist
			fs.mkdirSync(resolve(this.options.directory));
			this.verbose('No logs directory found, creating one for you');
		}
		this.clearOldFiles(logs => {
			if (logs >= 1) this.verbose(`Deleted ${logs} old log ${plural('file', logs)}`);
		}); // delete old files
		this.verbose(`Preparing log file ("${this.path}")`);
		fs.appendFileSync(this.path, require('./header')(this.options));
	}

	/** Append a line to the log file */
	writeLine(str) {
		if (this.options.daily) {
			let prev = join(this.options.directory, `/${dtf('YYYY-MM-DD')}.log`);
			if (this.path !== prev) {
				this.path = prev;
				this.prepareFile();
			}
		}
		fs.appendFileSync(this.path, str + '\n');
	}

	/**
	 * @description Register a new extension
	 * @param {string} name - the extension name, used for storing options
	 * @param {Object} o - options for this extension (this.options[name])
	 */
	register(name, o) {
		if (!this.ext.includes(name)) {
			this.verbose(`${capitalise(name)} extension enabled`);
			this.ext.push(name);
		}	
		this.options[name] = o;
	}
}

module.exports = Logger;