/**
 * @module leekslazylogger
 * @author eartharoid <contact@eartharoid.me>
 * @description An easy-to-use and lightweight Node.JS logger with file support, colours, and timestamps.
 * @copyright 2020 Isaac Saunders (eartharoid)
 * @license MIT
 */

const { Console } = console;
const merge = require('@eartharoid/deep-merge'); // for merging defaults with passed options
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
	 * @param {object} o - customise your logger with options
	 * @param {string} o.name - name of your project, will appear at the top of log files
	 * @param {string} o.timestamp - timestamp format
	 * @param {boolean} o.logToFile - log everything to a file?
	 * @param {boolean} o.splitFile - split the log file into separate stdout and stderr files?
	 * @param {number} o.header - include header in log files?
	 * @param {number} o.maxAge - number of days to keep old log files (-1 to delete all)
	 * @param {boolean} o.daily - make a new file at the start of every day?
	 * @param {boolean} o.keepSilent - hide startup messages from the logger?
	 * @param {boolean} o.debug - log debug messages?
	 * @param {boolean} o.directory - log files directory
	 * @param {object} o.levels - object of custom levels, see [docs](https://logger.eartharoid.me/customisation/#log-levels) for help
	 */
	constructor(o) {
		this.options = defaults;
		this.ext = [];

		if (typeof o === 'object') this.options = merge(this.options, o);

		for (let level in this.options.levels) {
			this[level] = (text, colour = [], ...args) => {
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

				if (!(colour instanceof Array)) {
					args.unshift(colour);
					colour = [];
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
					.replace(/{+ ?timestamp ?}+/gmi, this.timestamp())
					.replace(/{+ ?text ?}+/gmi, text);

				console[l.type](format, ...args);

				if (this.options.logToFile && level !== '_logger')
					this.writeLine(l.type, format, ...args); // append line to log file
			};
		}

		this.verbose(`Initialising leekslazylogger (v${pkg.version})`);

		if (this.options.logToFile === true) this.prepareFile();
		else this.verbose('Logging to file is &4disabled');

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
		if (!this.options.keepSilent) return this._logger(Logger.f(text));
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

	get baseFileName () {
		return this.options.daily
			? dtf('YYYY-MM-DD')
			: dtf('YYYY-MM-DD-HH-mm-ss');
	}

	get stdoutPath() {
		return this.options.splitFile
			? join(this.options.directory, `/${this.baseFileName}-stdout.log`)
			: join(this.options.directory, `/${this.baseFileName}.log`);
	}

	get stderrPath() {
		return this.options.splitFile
			? join(this.options.directory, `/${this.baseFileName}-stderr.log`)
			: join(this.options.directory, `/${this.baseFileName}.log`);
	}

	/** Append the header to the log file, creating the file if it doesn't already exist */
	prepareFile() {
		this.verbose(`Preparing log ${plural('file', this.options.splitFile ? 2 : 1)}`);

		if (!fs.existsSync(resolve(this.options.directory))) { // create logs folder if it doesn't exist
			fs.mkdirSync(resolve(this.options.directory));
			this.verbose('No logs directory found, creating one for you');
		} else {
			this.clearOldFiles(logs => {
				if (logs >= 1) this.verbose(`Deleted ${logs} old log ${plural('file', logs)}`);
			}); // delete old files
		}

		this.today = dtf('YYYY-MM-DD');

		if (this.stdout) this.stdout.end();
		if (this.stderr) this.stderr.end();

		this.stdout = fs.createWriteStream(this.stdoutPath, {
			flags: 'a', // append to end instead of overwriting
		});
		this.stderr = fs.createWriteStream(this.stderrPath, {
			flags: 'a', // append to end instead of overwriting
		});
		this.file = new Console({
			stdout: this.stdout,
			stderr: this.stderr
		});

		let header = require('./header')(this.options);
		this.file.log(header);
		if (this.options.splitFile)
			this.file.error(header);
	}

	/** Append a line to the log file */
	writeLine(type, str, ...args) {
		const needsNewFile = this.today !== dtf('YYYY-MM-DD');
		if (this.options.daily && needsNewFile) this.prepareFile();
		if (!this.options.splitFile) type = 'log';
		this.file[type](strip(str), ...args);
	}

	/**
	 * @description Register a new extension
	 * @param {string} name - the extension name, used for storing options
	 * @param {Object} o - options for this extension (this.options[name])
	 */
	register(name, o) {
		if (typeof o === 'object') this.options[name] = o;
		if (this.ext.includes(name)) return;
		this.verbose(`${capitalise(name)} extension enabled`);
		this.ext.push(name);
	}
}

module.exports = Logger;