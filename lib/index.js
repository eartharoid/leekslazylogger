/**
 * @module leekslazylogger
 * @author eartharoid <contact@eartharoid.me>
 * @description An easy-to-use and lightweight Node.JS logger with file support, colours, and timestamps.
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license MIT
 */

const timestamp = require('@eartharoid/dtf'); // for the timestamp & file name
const leeks = require('leeks.js'); // Like chalk, terminal colours & styles
const pkg = require('../package.json'); // for version and author info etc
const fs = require('fs'); // if you don't know what this is you shouldn't be reading this
const header = require('./header.js'); // header for log files is stored externally
const data = require('./data.js'); // colour codes, defaults etc
const termCodes = require('leeks.js/data'); // terminal codes

let log;

const plural = (word, num) => num !== 1 ? word + 's' : word;

const codesRegex = /&[0-9a-fi-or]|&![0-9a-f]/g;
const replaceCodes = (str) =>
	str.replace(codesRegex, cs => `\x1b[${termCodes[data.codes[cs][0]][data.codes[cs][1]]}m`) + '\x1b[0m';

// check if unnecessary messages have been disabled and if not, send them
const verbose = (silent, text) => {
	if (!silent) return console.log(text);
};

const strip = (t) =>
	t.replace(/\u001b\[.*?m/g, '').replace(codesRegex, ''); // remove leeks colours and &codes

const colourType = str => typeof str === 'number' ? 'eightBit' : str.includes(',') ? 'rgb' : str.startsWith('#') ? 'hex' : str.startsWith('&') ? 'CODE' : 'colours';
const bgColourType = str => typeof str === 'number' ? 'eightBitBg' : str.includes(',') ? 'rgbBg' : str.startsWith('#') ? 'hexBg' : str.startsWith('&') ? 'CODE' : 'colours';

const one_day = 1000 * 60 * 60 * 24;
const clearOldFiles = (maxAge, keepSilent, stamp, callback) => {
	// delete any log files older than options.maxAge days
	const files = fs.readdirSync('./logs/').filter(file => file.endsWith('.log'));
	let logs = 0;
	let today = new Date();
	for (const file of files) { // cycle through each file
		let lastMod = new Date(fs.statSync(`./logs/${file}`).mtime);
		if (Math.floor((today - lastMod) / one_day) > maxAge) { // check
			fs.unlinkSync(`./logs/${file}`); // delete
			logs++;
		}
	}
	callback(logs);
};

const createNewFile = (o, path) => {
	if (!fs.existsSync('./logs')) { // create logs folder if it doesn't exist
		fs.mkdirSync('./logs');
		verbose(o.keepSilent, `[${timestamp(o.timestamp)} | LOGGER] No logs directory found, creating one for you`);
	}
	return new Promise((resolve, reject) => {
		clearOldFiles(o.maxAge, o.keepSilent, o.timestamp, logs => {
			if (logs >= 1) verbose(o.keepSilent, `[${timestamp(o.timestamp)} | LOGGER] Deleted ${logs} old log ${plural('file', logs)}`);
		}); // delete old files

		verbose(o.keepSilent, `[${timestamp(o.timestamp)} | LOGGER] Preparing log file ("${path}")`);
		fs.appendFileSync(path, header(o), (error) => {
			if (error) {
				console.error(leeks.colours.red(error));
				reject(error);
			}
			resolve(true);
		});
	});
};

const fileService = (o, path) => {
	if (o.daily === false) return path; // stop here if daily logging is disabled
	let prev = `./logs/${timestamp('YYYY-MM-DD')}.log`;
	return new Promise((resolve) => {
		if (path !== prev) {
			path = prev;
			createNewFile(o, path);
			//.then(() => resolve(path));
		}
		resolve(path); // return same path
	});
};

class LoggerError extends Error {
	constructor(message) {
		console.log(leeks.colours.yellowBright(`[LOGGER] Logger error thrown. Perhaps you should read the documentation at ${pkg.homepage} ..?`));
		super(message);
		// this.name = 'UnknownCodeError';
	}
}

/**
 * @description Logger object with options (o)
 * @param {object} o - customise your logger with options
 * @param {string} o.name - name of your project, will appear at the top of log files
 * @param {boolean} o.logToFile - log everything to a file?
 * @param {boolean} o.daily - Make a new file at the start of every day?
 * @param {boolean} o.keepSilent - Hide startup messages from the logger?
 * @param {boolean} o.translateCodes - Convert &codes to colours?
 * @param {string} o.timestamp - timestamp format
 * @param {number} o.maxAge - number of days to keep old log files (-1 to delete all)
 * @param {object} o.custom - object of custom types, see wiki for help
 */
class Logger {
	constructor(o) {
		if (o && typeof o !== 'object') throw new TypeError('Options must be an object');
		if (!o) o = {};
		if (o.child) {
			if (!log) {
				console.error(leeks.colours.redBright(`[LOGGER] You can't create a child logger before calling the .multi() function (see documentation at ${pkg.homepage})`));
				throw new LoggerError('Logger not initialised for child loggers.');
			}
			for (let item in log) this[item] = log[item];
		}

		this.options = {};

		if (o.child) {
			this.path = log.path;
			this.options = log.options;
		} else {
			// if no options were passed, create an empty object so defaults can be set
			if (!o) o = {};

			this.custom = o.custom;

			this.options = { // set the defaults
				...data.defaults
			};

			Object.assign(this.options, o); // overwrite defaults with any options passed

			if (this.options.daily === false) {
				this.path = `./logs/${timestamp('YYYY-MM-DD-HH-mm-ss')}.log`;
			} else {
				this.path = `./logs/${timestamp('YYYY-MM-DD')}.log`;
			}
		}

		// timestamp function
		this.stamp = () => timestamp(this.options.timestamp);

		// STOP HERE IF IT IS A CHILD LOGGER
		if (o.child === true) return;

		/*
		 *
		 * SET UP THE DEFAULT LOG TYPES
		 *
		 */

		for (let type in data.defaultTypes) {
			/**
			 * @param {string} text - the text to log
			 * @param {object} options - colours
			 */
			this[type] = async (text, colour) => {
				let t = data.defaultTypes[type],
					title = t.title ? ` | ${t.title.toUpperCase()}` : '',
					pre = `[${this.stamp() + title}] `;

				if ((t.log === 'debug' && this.options.debug === false) || !text) return;

				try {
					if (typeof text !== 'string')
						text = JSON.stringify(text, null, 2); // stringify objects
				} catch (e) {
					// do nothing
				}

				if (this.options.logToFile) {
					this.path = await fileService(this.options, this.path); // check to see if a new file should be created	
					fs.appendFileSync(this.path, `[${this.stamp() + title}] ${strip(text)}\n`, (error) => {
						if (error) throw error;
					});
				}

				if (leeks.supportsColour) {
					let fg = colour ? colour[0] : t.c[0];
					let bg = colour ? colour[1] : t.c[1];
					let fgt = 'colours',
						bgt = 'colours';

					if (colour) {
						if (fg)
							fgt = colourType(fg);
						if (bg) {
							bgt = bgColourType(bg);

							if (bgt == 'colours' && !bg.startsWith('bg'))
								bg = 'bg' + bg[0].toUpperCase() + bg.substring(1); // convert FG colour name to BG

							if (bgt === 'CODE') {
								bgt = 'colours';
								if (bg[1] !== '!') bg = '&!' + bg[1];
								bg = data.codes[bg][1];
							}

							if (bgt === 'rgb') bg = bg.replace(' ', '').split(',');
						}

						if (fgt === 'CODE')
							fgt = 'colours',
							fg = data.codes[fg][1];

						if (fgt === 'rgb') fg = fg.replace(' ', '').split(',');

					}

					let bgf = !bg ? pre + text : bgt === 'colours' ? leeks[bgt][bg](pre + text) : leeks[bgt](bg, pre + text);

					if (!fg) console[t.log](bgf);
					else console[t.log](fgt === 'colours' ? leeks[fgt][fg](bgf) : leeks[fgt](fg, bgf));

				} else console[t.log](pre + strip(text)); // for weirdos who don't like colours
			};
		}

		/*
		 *
		 * AND NOW THE CUSTOM TYPES
		 *
		 */
		let custom = 0;
		for (let type in this.custom) {
			this[type] = async (text, colour) => {
				let t = this.custom[type],
					title = t.title ? ` | ${t.title.toUpperCase()}` : '',
					pre = `[${this.stamp() + title}] `;

				if (!t.type) t.type = 'info';

				if ((t.type === 'debug' && this.options.debug === false) || !text) return;

				try {
					if (typeof text !== 'string')
						text = JSON.stringify(text, null, 2); // stringify objects
				} catch (e) {
					// do nothing
				}

				if (this.options.logToFile) {
					this.path = await fileService(this.options, this.path); // check to see if a new file should be created	
					fs.appendFileSync(this.path, `[${this.stamp() + title}] ${strip(text)}\n`, (error) => {
						if (error) throw error;
					});
				}

				if (leeks.supportsColour) {
					let fg = colour ? colour[0] : t.foreground;
					let bg = colour ? colour[1] : t.background;
					let fgt = 'colours',
						bgt = 'colours';

					if (fg)
						fgt = colourType(fg);

					if (bg) {
						bgt = bgColourType(bg);

						if (bgt == 'colours' && !bg.startsWith('bg'))
							bg = 'bg' + bg[0].toUpperCase() + bg.substring(1); // convert FG colour name to BG
						if (bgt === 'CODE') {
							bgt = 'colours';
							if (bg[1] !== '!') bg = '&!' + bg[1];
							bg = data.codes[bg][1];
						}
						if (bgt === 'rgb') bg = bg.replace(' ', '').split(',');
					}

					if (fgt === 'CODE')
						fgt = 'colours',
						fg = data.codes[fg][1];
					if (fgt === 'rgb') fg = fg.replace(' ', '').split(',');

					let bgf = !bg ? pre + text : bgt === 'colours' ? leeks[bgt][bg](pre + text) : leeks[bgt](bg, pre + text);

					if (!fg) console[t.type](bgf);
					else console[t.type](fgt === 'colours' ? leeks[fgt][fg](bgf) : leeks[fgt](fg, bgf));

				} else console[t.type](pre + strip(text)); // for weirdos who don't like colours
			};
			custom++; // counter (doesn't do anything)
		}

		/*
		 *
		 * FILE MANAGEMENT
		 *
		 */

		// send startup messages
		verbose(this.options.keepSilent, `[${this.stamp()} | LOGGER] Initialising logger (v${pkg.version})`);

		if (this.options.logToFile === true) createNewFile(this.options, this.path);
		else return verbose(this.options.keepSilent, `[${this.stamp()} | LOGGER] Logging to file is ${leeks.colours.redBright('disabled')}`);

		if (custom >= 1) {
			verbose(this.options.keepSilent, `[${this.stamp()} | LOGGER] Initialised with ${custom} custom log ${plural('type', custom)}`);
		}
	}

	stamp() {
		return timestamp(this.options.timestamp);
	}

	multi(obj) {
		if (!obj || typeof obj !== 'object') {
			console.log(leeks.colours.yellowBright(`[${this.stamp()} | LOGGER] You must pass the Logger instance when calling the .multi() function (see documentation at ${pkg.homepage})`));
			throw new TypeError('Logger instance not passed, type must be an object.');
		}
		log = obj;
		verbose(this.options.keepSilent, `[${this.stamp()} | LOGGER] Multi-Logger initialised; child loggers can now be created`);
	}

	format(str) {
		return replaceCodes(str);
	}

	f(str) {
		return replaceCodes(str);
	}

	// static setPath(path) { // doesn't work because this does not refer to the correct thing
	// 	this.path = path;
	// }
}

module.exports = Logger;

/**
 * @description Child logger object - no options, has all of the logging functions but doesn't create new files
 */
module.exports.ChildLogger = class ChildLogger extends Logger {
	constructor() {
		super({
			child: true
		});
	}
};

// legacy "support" (a warning)
module.exports.init = () => {
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