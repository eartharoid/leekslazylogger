const data = require('./data'); // colour codes, defaults etc
const termCodes = require('leeks.js/lib/data'); // terminal codes

const codesRegex = /&[0-9a-fi-or]|&![0-9a-f]/g;

module.exports = class Functions {
	static plural (word, num) {
		return num !== 1 ? word + 's' : word;
	}

	static replaceCodes (str) {
		return str.replace(codesRegex, cs => `\x1b[${termCodes[data.codes[cs][0]][data.codes[cs][1]]}m`) + '\x1b[0m';
	}

	static strip (t) {
		return t.replace(/\u001b\[.*?m/g, '').replace(codesRegex, ''); // remove leeks colours and &codes
	}

	static capitalise (str) {
		// return str.replace(/^\w/, first => first.toUpperCase());
		return str.charAt(0).toUpperCase() + str.slice(1); // probably more efficient
	}

	static colourType (str) {
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