const codes = require('./codes'); // short codes
const { default: colours } = require('leeks.js/dist/data/Colours'); // terminal codes for colours
const { default: styles } = require('leeks.js/dist/data/Styles'); // terminal codes for styles

const hexToRgb = hex => {
	const number = parseInt(hex, 16);
	return [(number >> 16) & 255, (number >> 8) & 255, number & 255];
};

module.exports = {
	plural: (word, num) => num === 1 ? word : word + 's',

	replaceCodes: str => str
		.replace(/&!?[0-9a-f]/gi, code => `\x1b[${colours[codes.colours[code]]}m`) // replace colour codes
		.replace(/&[i-pr]/gi, code => `\x1b[${styles[codes.styles[code]]}m`) // replace style codes
		.replace(/&#!?([0-9A-Fa-f]{3,6})/gi, ($_, code) => {
			const pre = $_.includes('!') ? '48' : '38';
			const [r, g, b] = hexToRgb(code);
			return `\x1b[${pre};2;${r};${g};${b}m`;
		}) // replace hex codes
		+ '\x1b[0m', // reset

	strip: str => str.replace(/\u001b\[.*?m/g, ''), // remove colours

	capitalise: str => str.charAt(0).toUpperCase() + str.slice(1),

	fgColourType: str => typeof str === 'number'
		? 'eightBit' : str.includes(',')
			? 'rgb' : str.startsWith('#')
				? 'hex' : str.startsWith('&')
					? 'CODE' : 'colours',

	bgColourType: str => typeof str === 'number'
		? 'eightBitBg' : str.includes(',')
			? 'rgbBg' : str.startsWith('#')
				? 'hexBg' : str.startsWith('&')
					? 'CODE' : 'colours',
};