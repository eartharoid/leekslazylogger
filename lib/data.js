/**
 * @name leekslazylogger
 * @author eartharoid <contact@eartharoid.me>
 * @description An easy-to-use and lightweight console logger for Node.JS with colour/styles & file support.
 * @license MIT
 *
 * defaults and formatting codes storage
 *
 */

module.exports.defaults = {
	name: 'A leekslazylogger project',
	logToFile: true,
	timestamp: 'HH:mm:ss',
	maxAge: 7,
	keepSilent: false,
	debug: false,
	directory: './logs/',
	types: {
		basic: {
			type: 'log',
			title: null
		},
		console: {
			type: 'log',
			title: 'INFO',
			foreground: 'white'
		},
		info: {
			type: 'info',
			title: 'INFO',
			foreground: 'cyan'
		},
		success: {
			type: 'info',
			title: 'INFO',
			foreground: 'green'
		},
		debug: {
			type: 'debug',
			title: 'DEBUG',
			foreground: 'blue'
		},
		notice: {
			type: 'warn',
			title: 'NOTICE',
			foreground: 'black',
			background: 'bgYellow'
		},
		warn: {
			type: 'warn',
			title: 'WARN',
			foreground: 'yellow'
		},
		error: {
			type: 'error',
			title: 'ERROR',
			foreground: 'red'
		}
	}
};

// 24 colouring and styling codes
module.exports.codes = {
	// first 10 of 16 colours           ---FOREGROUND---
	'&0': ['colors', 'black'],
	'&1': ['colors', 'blue'],
	'&2': ['colors', 'green'],
	'&3': ['colors', 'cyan'],
	'&4': ['colors', 'red'],
	'&5': ['colors', 'magenta'],
	'&6': ['colors', 'yellow'],
	'&7': ['colors', 'blackBright'],
	'&8': ['colors', 'whiteBright'],
	'&9': ['colors', 'blueBright'],
	// last 6 of 16 colours, lighter    ---FOREGROUND---
	'&a': ['colors', 'greenBright'],
	'&b': ['colors', 'cyanBright'],
	'&c': ['colors', 'redBright'],
	'&d': ['colors', 'magentaBright'],
	'&e': ['colors', 'yellowBright'],
	'&f': ['colors', 'white'],
	// 8 styling codes                    ---STYLES---
	'&i': ['styles', 'inverse'],
	'&j': ['styles', 'dim'],
	'&k': ['styles', 'blink'],
	'&l': ['styles', 'bold'],
	'&m': ['styles', 'strikethrough'],
	'&n': ['styles', 'underline'],
	'&o': ['styles', 'italic'],
	'&r': ['styles', 'reset'],
	// first 10 of 16 colours           ---BACKGROUND---
	'&!0': ['colors', 'bgBlack'],
	'&!1': ['colors', 'bgBlue'],
	'&!2': ['colors', 'bgGreen'],
	'&!3': ['colors', 'bgCyan'],
	'&!4': ['colors', 'bgRed'],
	'&!5': ['colors', 'bgMagenta'],
	'&!6': ['colors', 'bgYellow'],
	'&!7': ['colors', 'bgBlackBright'],
	'&!8': ['colors', 'bgWhiteBright'],
	'&!9': ['colors', 'bgBlueBright'],
	// last 6 of 16 colours, lighter    ---BACKGROUND---
	'&!a': ['colors', 'bgGreenBright'],
	'&!b': ['colors', 'bgCyanBright'],
	'&!c': ['colors', 'bgRedBright'],
	'&!d': ['colors', 'bgMagentaBright'],
	'&!e': ['colors', 'bgYellowBright'],
	'&!f': ['colors', 'bgWhite'],
};
