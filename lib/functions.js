const fs = require('fs');
const timestamp = require('@eartharoid/dtf'); // for the timestamp & file name
const header = require('./header.js'); // header for log files is stored externally
const leeks = require('leeks.js'); // Like chalk, terminal colours & styles
const data = require('./data.js'); // colour codes, defaults etc
const termCodes = require('leeks.js/lib/data'); // terminal codes

const codesRegex = /&[0-9a-fi-or]|&![0-9a-f]/g;

module.exports = class Functions {
	static plural (word, num) {
		num !== 1 ? word + 's' : word;
	}

	// check if unnecessary messages have been disabled and if not, send them
	static verbose (silent, text) {
		if (!silent) return console.log(text);
	}

	static replaceCodes (str) {
		str.replace(codesRegex, cs => `\x1b[${termCodes[data.codes[cs][0]][data.codes[cs][1]]}m`) + '\x1b[0m';
	}

	static strip (t) {
		t.replace(/\u001b\[.*?m/g, '').replace(codesRegex, ''); // remove leeks colours and &codes
	}

	static clearOldFiles (maxAge, _keepSilent, _stamp, callback) {
		const one_day = 1000 * 60 * 60 * 24;

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
	}

	static createNewFile (o, path) {
		if (!fs.existsSync('./logs')) { // create logs folder if it doesn't exist
			fs.mkdirSync('./logs');
			this.verbose(o.keepSilent, `[${timestamp(o.timestamp)} | LOGGER] No logs directory found, creating one for you`);
		}

		return new Promise((resolve, reject) => {
			this.clearOldFiles(o.maxAge, o.keepSilent, o.timestamp, logs => {
				if (logs >= 1) this.verbose(o.keepSilent, `[${timestamp(o.timestamp)} | LOGGER] Deleted ${logs} old log ${this.plural('file', logs)}`);
			}); // delete old files

			this.verbose(o.keepSilent, `[${timestamp(o.timestamp)} | LOGGER] Preparing log file ("${path}")`);
			fs.appendFileSync(path, header(o), (error) => {
				if (error) {
					console.error(leeks.colours.red(error));
					reject(error);
				}
				resolve(true);
			});
		});
	}

	static fileService (o, path) {
		if (o.daily === false) return path; // stop here if daily logging is disabled
		let prev = `./logs/${timestamp('YYYY-MM-DD')}.log`;
		return new Promise((resolve) => {
			if (path !== prev) {
				path = prev;
				this.createNewFile(o, path);
				//.then(() => resolve(path));
			}
			resolve(path); // return same path
		});
	}
};