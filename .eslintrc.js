module.exports = {
	'env': {
		'commonjs': true,
		'es6': true,
		'browser': false,
		'node': true
	},
	'extends': 'eslint:recommended',
	'globals': {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly'
	},
	'parserOptions': {
		'ecmaVersion': 2019
	},
	'rules': {
		'indent': [
			'warn',
			'tab'
		],
		'linebreak-style': [
			'off',
			'windows'
		],
		'quotes': [
			'warn',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		'no-control-regex': [
			'off'
		],
		'no-console': [
			'off'
		],
		'no-mixed-spaces-and-tabs': [
			'off'
		]
	}
};