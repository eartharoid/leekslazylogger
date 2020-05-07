/**
 * @module leekslazylogger
 * @author eartharoid <contact@eartharoid.me>
 * @description An easy-to-use and lightweight console logger for Node.JS with colour/styles & file support.
 * @copyright 2020 Isaac Saunders (eartharoid) 
 * @license MIT
 */

const timestamp = require('@eartharoid/dtf'); // for the timestamp & file name
const leeks = require('leeks.js'); // Like chalk, terminal colours & styles
const pkg = require('./package.json'); // for version and author info etc
const fs = require('fs'); // if you don't know what this is you shouldn't be reading this
const header = require('./header.js'); // header for log files is stored externally
const data = require('./data.js'); // colour codes, defaults etc
const termCodes = require('leeks.js/data'); // terminal codes

let log;

const plural = (word, num) => num !== 1 ? word + 's' : word;

const codesRegex = /&[0-9a-fi-or]|&![0-9a-f]/g;
const replaceCodes = (string) => string.replace(codesRegex, (cs) => `\x1b[${termCodes[data.codes[cs][0]][data.codes[cs][1]]}m`) + '\x1b[0m';

// check if unecessary messages have been disabled and if not, send them
const verbose = (silent, text) => {
	if (silent === false) return console.log(text);
};

const strip = t => t.replace(/\u001b\[.*?m/g, '');

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
	if (!fs.existsSync('./logs')) { // create logs folder if it doesnt exist
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
	let stamp = `./logs/${timestamp(o.dateFormat)}.log`;
	if (path !== stamp) {
		path = stamp;
		return new Promise((resolve) => {
			// make a new log
			createNewFile(o, path).then(() => resolve(path));
		});
	} else {
		return path;
	}

};

class UnknownCodeError extends Error {
	constructor(message) {
		console.log(leeks.colours.yellowBright(`[LOGGER] Logger error thrown. Perhaps you should read the documentation at ${pkg.homepageDisplayURL} ..?`));
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
				console.error(leeks.colours.redBright(`[LOGGER] You can't create a child logger before calling the .multi() function (see documentation at ${pkg.homepageDisplayURL})`));
				throw new Error('Logger not initialised for child loggers.');
			}
			for (let item in log) {
				this[item] = log[item];
			}
		}

		this.options = {};

		// make leeks colours and styles available
		this.c = leeks.colours;
		this.color = leeks.colors;
		this.colors = leeks.colors;
		this.colour = leeks.colours;
		this.colours = leeks.colours;
		this.s = leeks.styles;
		this.style = leeks.styles;
		this.styles = leeks.styles;

		this.supportsColor = leeks.supportsColor;
		this.supportsColour = leeks.supportsColour;

		this.hex = leeks.hex;
		this.hexBg = leeks.hexBg;
		this.rgb = leeks.rgb;
		this.rgbBg = leeks.rgbBg;
		this.eight = leeks.eightBit;
		this.eightBg = leeks.eightBitBg;

		this.dtf = (str) => {
			return timestamp(str);
		};

		/*
         * 
         * OPTIONS AND OTHER STUFF
         * 
         */


		if (o.child) {
			this.path = log.path;
			this.options = log.options;
		} else {
			// if no options were passed, create an empty object so defaults can be set
			if (!o) o = {};

			this.custom = o.custom;

			// name of project
			this.options.name = o.name ? o.name : data.defaults.name;

			// log everything to a file?
			this.options.logToFile = o.logToFile === false ? false : data.defaults.logToFile;

			// timestamp format to be used in log file and console
			this.options.timestamp = o.timestamp ? o.timestamp : data.defaults.timestamp;

			// datestamp format to be used in log file's name
			// * @param {string} o.dateFormat - datestamp format (only used in log file's name)
			// this.options.dateFormat = o.dateFormat ? o.dateFormat : data.defaults.dateFormat;
			this.options.dateFormat = 'YYYY-MM-DD';

			// how long to keep files (in days)
			this.options.maxAge = o.maxAge ? o.maxAge : data.defaults.maxAge;

			// hide logger startup messages? cleaner but less informative.
			this.options.keepSilent = o.keepSilent ? o.keepSilent : data.defaults.keepSilent;

			// 1 log file per day or 1 per run?
			if (o.daily === false) {
				this.options.daily = false;
				this.path = `./logs/${timestamp(`${this.options.dateFormat}-HH-mm-ss`)}.log`;
			} else {
				this.options.daily = true;
				this.path = `./logs/${timestamp(this.options.dateFormat)}.log`;
			}
		}

		// timestamp function
		// this.stamp = () => timestamp(this.options.timestamp);


		// STOP HERE IF IT IS A CHILD LOGGER
		if (o.child === true) return;

		/*
         * 
         * SET UP THE DEFAULT LOG TYPES
         * 
         */

		for (let type in data.defaultTypes) {
			// check if is a string before applying colours!!!
			// check colour support, log to console, log to file (if enabled)
			/**
             * @param {string} text - the text to log
             * @param {object} options - colours, styles, and insertions
             */
			this[type] = async (text, options) => {
				let t = data.defaultTypes[type],
					title = t.title ? ` | ${t.title.toUpperCase()}` : '';

				if (o.logToFile) {
					this.path = await fileService(this.options, this.path); // check to see if a new file should be created	
					fs.appendFileSync(this.path, `[${this.stamp() + title}] ${strip(text)}\n`, (error) => {
						if (error) throw error;
					});
				}

				if (leeks.supportsColour) {
					let fg = 1,
						bg = 2,
						pre = (`[${this.stamp() + title}] ${replaceCodes(text)}`);
					console.log(leeks.colours[fg](pre));
				} else {
					console.log(`[${this.stamp() + title}] ${replaceCodes(text)}`);
				}


			};
		}

		/*
         * 
         * AND NOW THE CUSTOM TYPES
         * 
         */
		let custom = 0;
		for (let type in this.custom) {
			// check colour support, log to console, log to file (if enabled)
			// include fileService(this.options, this.path); in the functions

			this[type] = (text) => {
				fileService(this.options, this.path);

				console.log(`[${this.stamp()} | ${this.custom[type].title.toUpperCase()}] ${replaceCodes(text)}`);
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

		if (this.options.logToFile === true) {
			createNewFile(this.options, this.path);
		} else {
			return verbose(this.options.keepSilent, `[${this.stamp()} | LOGGER] Logging to file is ${leeks.colours.redBright('disabled')}`);
		}


		if (custom >= 1) {
			verbose(this.options.keepSilent, `[${this.stamp()} | LOGGER] Initialised with ${custom} custom log ${plural('type', custom)}`);
		}

	}

	stamp() {
		return timestamp(this.options.timestamp);
	}

	multi(obj) {
		if (!obj || typeof obj !== 'object') {
			console.log(leeks.colours.yellowBright(`[${this.stamp()} | LOGGER] You must pass the Logger instance when calling the .multi() function (see documentation at ${pkg.homepageDisplayURL})`));
			throw new TypeError('Logger instance not passed, type must be an object.');
		}
		log = obj;
		verbose(this.options.keepSilent, `[${this.stamp()} | LOGGER] Multi-Logger initialised; child loggers can now be created`);
	}

	static setPath(path) { // doesn't work because this does not refer to the correct thing
		this.path = path;
	}
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

// legacy support (a warning)
module.exports.init = () => {
	console.log(leeks.colours.bgYellowBright(leeks.colours.black('[LOGGER] IMPORTANT NOTICE ABOUT LEEKSLAZYLOGGER')));
	console.log(leeks.colours.greenBright(`
    leekslazylogger was completely rewritten for v2 and no longer works in the same way.
    For help updating your code, read the documentation at ${leeks.colours.yellowBright(pkg.homepageDisplayURL + ' or github.com/eartharoid/leekslazylogger')}`));
	console.log(leeks.colours.greenBright(`
    Or if you don't want to update, install the legacy version with:`));
	console.log(leeks.colours.yellowBright(`
    "npm i leekslazylogger@1.1.9"`));
	console.log(leeks.colours.greenBright(`
    Note that unless you used custom log types, you don't need to change much of your code to update.
    \n`));
};