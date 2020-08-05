/**
 * @name leekslazylogger
 * @author eartharoid <contact@eartharoid.me>
 * @description An easy-to-use and lightweight console logger for Node.JS with colour/styles & file support.
 * @license MIT
 * 
 * defaults and formatting codes storage
 * 
 */

module.exports.defaultTypes = {
	basic: {log: 'log', title: null, c: ['white']},
	console: {log: 'log', title: 'INFO', c: ['white']},
	info: {log: 'info', title: 'INFO', c: ['cyan']},
	success: {log: 'info', title: 'INFO', c: ['green']},
	debug: {log: 'debug', title: 'DEBUG', c: ['blue']},
	notice: {log: 'warn', title: 'NOTICE', c: ['black', 'bgYellow']},
	warn: {log: 'warn', title: 'WARN', c: ['yellow']},
	error: {log: 'error', title: 'ERROR', c: ['red']}
};

module.exports.defaults = {
	name: 'A leekslazylogger project',
	logToFile: true,
	timestamp: 'HH:mm:ss',
	dateFormat: 'YYYY-MM-DD',
	maxAge: 7,
	keepSilent: false,
	debug: false
};

// 24 colouring and styling codes 
module.exports.codes = {
	// first 10 of 16 colours           --FOREGROUND---
	'&0': ['colors', 'black'],
	'&1': ['colors', 'blue'],
	'&2': ['colors', 'green'],
	'&3': ['colors', 'cyan'],
	'&4': ['colors', 'red'],
	'&5': ['colors', 'magenta'],
	'&6': ['colors', 'yellow'],
	'&7': ['colors', 'blackBright'],
	'&8': ['colors', 'whiteBright'],
	'&9': ['colors', 'cyanBright'],
	// last 6 of 16 colours, lighter    ---FOREGROUND---
	'&a': ['colors', 'greenBright'],
	'&b': ['colors', 'blueBright'],
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
	'&!8': ['colors', 'bgBlackBright'],
	'&!9': ['colors', 'bgCyanBright'],
	// last 6 of 16 colours, lighter    ---BACKGROUND---
	'&!a': ['colors', 'bgGreenBright'],
	'&!b': ['colors', 'bgBlueBright'],
	'&!c': ['colors', 'bgRedBright'],
	'&!d': ['colors', 'bgMagentaBright'],
	'&!e': ['colors', 'bgYellowBright'],
	'&!f': ['colors', 'bgWhite'],
};

