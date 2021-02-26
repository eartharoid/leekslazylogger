/* eslint-disable no-prototype-builtins */
const codes = require('./codes'); // short codes
const { default: colours } = require('leeks.js/dist/data/Colours'); // terminal codes for colours
const { default: styles } = require('leeks.js/dist/data/Styles'); // terminal codes for styles

const deepMerge = (...args) => {
	let target = {};
	const merge = (obj) => {
		for (let prop in obj) 
			if (obj.hasOwnProperty(prop)) 
				if (typeof obj[prop] === 'object')
					target[prop] = deepMerge(target[prop], obj[prop]);
				else
					target[prop] = obj[prop];
	};
	args.forEach(arg => merge(arg));
	return target;
};


module.exports = {
	plural: (word, num) => num === 1 ? word : word + 's',

	replaceCodes: str => str
		.replace(/&!?[0-9a-f]/g, code => `\x1b[${colours[codes.colours[code]]}m`) // replace colour codes
		.replace(/&[i-or]/g, code => `\x1b[${styles[codes.styles[code]]}m`) // replace style codes
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

	deepMerge
};