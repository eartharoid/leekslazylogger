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
} = require('./functions');

let ready,
	path,
	options = data.defaults,
	ext = {};

class LoggerError extends Error {
	constructor(message) {
		console.log(leeks.colours.yellow(`[LOGGER] Logger error thrown. Perhaps you should read the documentation at ${pkg.homepage} ..?`));
		super(message);
	}
}

class Logger {
	/**
	 * @description Logger object with options (o)
	 * @param {object} o - customise your logger with options
	 * @param {string} o.name - name of your project, will appear at the top of log files
	 * @param {boolean} o.logToFile - log everything to a file?
	 * @param {boolean} o.daily - Make a new file at the start of every day?
	 * @param {boolean} o.keepSilent - Hide startup messages from the logger?
	 * @param {string} o.timestamp - timestamp format
	 * @param {number} o.maxAge - number of days to keep old log files (-1 to delete all)
	 * @param {object} o.custom - object of custom types, see wiki for help
	 */
	constructor(o) {
		if (o) {
			if (typeof o !== 'object') throw new TypeError('Logger options must be an object');
			Object.assign(options, o);
			merge(options.types, options.custom); // deep merge
		}

		for (let type in options.types) {
			this[type] = (text, colour) => {
				let t = options.types[type],
					title = t.title ? ` | ${t.title.trim().toUpperCase()}` : '',
					timestamp = `[${this.timestamp() + title}] `,
					prefix = t.prefix ? `[${t.prefix.trim().toUpperCase()}] ` : '';

				if (!t.type) t.type = 'info';
				t.type = t.type.trim().toLowerCase();

				if ((t.type === 'debug' && options.debug === false) || !text) return;

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
				if (options.logToFile) this.writeLine(timestamp + prefix + strip(text) + '\n');
			};

		}

		// this only needs to run once
		if (ready) return;
		ready = true; 

		this.verbose(`[${this.timestamp()} | LOGGER] Initialising logger (v${pkg.version})`);

		if (options.logToFile === true) {
			
			if (options.daily === false) path = join(options.directory, `/${dtf('YYYY-MM-DD-HH-mm-ss')}.log`); // 1 per run
			else path = join(options.directory, `/${dtf('YYYY-MM-DD')}.log`); // 1 per day

			this.createNewFile();

		} else this.verbose(`[${this.timestamp()} | LOGGER] Logging to file is ${leeks.colours.redBright('disabled')}`);

		let custom = options.types.length - data.defaults.types.length;
		if (options.types.length > data.defaults.types.length) this.verbose(`[${this.timestamp()} | LOGGER] Initialised with ${custom} custom log ${plural('type', custom)}`);

	}

	/**
	 * @description Returns timestamp
	 * @returns {string} timestamp
	 */
	timestamp() {
		return dtf(options.timestamp);
	}

	/**
	 * @description Enable child loggers to be created
	 * @deprecated This is no longer necessary (never really was necessary, actually)
	 */
	multi() {
		this.verbose(leeks.colours.yellow(`[${this.timestamp()} | LOGGER] Logger#multi() is deprecated, it is no longer required`));
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
	 * @deprecated Use the static method instead
	 */
	format(str) {
		return replaceCodes(str);
	}

	/**
	 * @description Format a string to add colour with '&' short-codes
	 * @param {string} String to format
	 * @returns {string} Formatted text
	 * @deprecated Use the static method instead
	 */
	f(str) {
		return replaceCodes(str);
	}

	verbose(text) {
		if (!options.keepSilent) return console.log(text);
	}

	clearOldFiles(callback) {
		const one_day = 1000 * 60 * 60 * 24;
		// delete any log files older than options.maxAge days
		const files = fs.readdirSync(resolve(options.directory)).filter(file => file.endsWith('.log'));
		let logs = 0;
		let today = new Date();
		for (const file of files) { // cycle through each file
			let lastMod = new Date(fs.statSync(join(options.directory, `/${file}`)).mtime);
			if (Math.floor((today - lastMod) / one_day) > options.maxAge) { // check
				fs.unlinkSync(join(options.directory, `/${file}`)); // delete
				logs++;
			}
		}
		callback(logs);
	}

	createNewFile() {
		if (!fs.existsSync(resolve(options.directory))) { // create logs folder if it doesn't exist
			fs.mkdirSync(resolve(options.directory));
			this.verbose(options.keepSilent, `[${dtf(options.timestamp)} | LOGGER] No logs directory found, creating one for you`);
		}
		this.clearOldFiles(logs => {
			if (logs >= 1) this.verbose(`[${dtf(options.timestamp)} | LOGGER] Deleted ${logs} old log ${plural('file', logs)}`);
		}); // delete old files
		this.verbose(`[${dtf(options.timestamp)} | LOGGER] Preparing log file ("${path}")`);
		fs.appendFileSync(path, require('./header')(options));
	}

	writeLine(str) {
		if (options.daily) {
			let prev = join(options.directory, `/${dtf('YYYY-MM-DD')}.log`);
			if (path !== prev) {
				path = prev;
				this.createNewFile();
			}
		}
		fs.appendFileSync(path, str);
	}

	get defaults() {
		return data.defaults;
	}

	get options() {
		return options;
	}

	set options(o) {
		merge(options, o);
	}

	static isMulti() {
		return ready === true;
	}

	register(name, o) {
		if (!ext[name]) {
			this.verbose(`[${this.timestamp()} | LOGGER] ${capitalise(name)} extension enabled`);
			ext[name] = true;
		}
			
		options[name] = o;
	}
}

module.exports = Logger;
module.exports.ChildLogger = Logger;

/**
 * @description DEPRECATED! READ THE DOCS: logger.eartharoid.me
 * @deprecated This doesn't do anything any more!
 */
module.exports.init = () => { // legacy "support" (a warning)
	console.log(leeks.colours.bgYellowBright(leeks.colours.black('[LOGGER] IMPORTANT NOTICE ABOUT LEEKSLAZYLOGGER (v1 DEPRECATED)')));
	console.log(leeks.colours.greenBright(`
    leekslazylogger was completely rewritten and v2 no longer works in the same way.
    For help updating your code, read the documentation at ${leeks.colours.yellowBright(pkg.homepage)}`));
	console.log(leeks.colours.greenBright(`
    Or if you don't want to update, install the legacy version with:`));
	console.log(leeks.colours.yellowBright(`
    "npm i leekslazylogger@1.1.9"`));
	console.log(leeks.colours.greenBright(`
    Note that unless you used custom log types, you don't need to change much of your code to update.
    \n`));
};