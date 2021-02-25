const codes = require('./codes'); // short codes
const { default: colours } = require('leeks.js/build/data/Colours'); // terminal codes for colours
const { default: styles } = require('leeks.js/build/data/Styles'); // terminal codes for styles

module.exports = class Utils {
	static plural(word, num) {
		return num === 1 ? word : word + 's';
	}

	static replaceCodes(str) {
		return str
			.replace(/&!?[0-9a-f]/g, code => `\x1b[${colours[codes.colours[code]]}m`)
			.replace(/&[i-or]/g, code => `\x1b[${styles[codes.styles[code]]}m`)
			+ '\x1b[0m';
	}

	static strip (str) {
		return str.replace(/\u001b\[.*?m/g, ''); // remove colours
	}

	static capitalise (str) {
		return str.charAt(0).toUpperCase() + str.slice(1); // probably more efficient than regex
	}

	static fgColourType (str) {
		return typeof str === 'number'
			? 'eightBit' : str.includes(',')
				? 'rgb' : str.startsWith('#')
					? 'hex' : str.startsWith('&')
						? 'CODE' : 'colours';
	} 

	static bgColourType (str) {
		return typeof str === 'number'
			? 'eightBitBg' : str.includes(',')
				? 'rgbBg' : str.startsWith('#')
					? 'hexBg' : str.startsWith('&')
						? 'CODE' : 'colours';
	} 
};