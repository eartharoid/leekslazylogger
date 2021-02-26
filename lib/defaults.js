module.exports = {
	name: 'A leekslazylogger project',
	logToFile: true,
	timestamp: 'HH:mm:ss',
	maxAge: 7,
	keepSilent: false,
	debug: false,
	daily: true,
	directory: './logs/',
	header: true,
	levels: {
		_logger: {
			type: 'log',
			format: '[{timestamp} | LOGGER] {text}'
		},
		basic: {
			type: 'log',
			format: '[{timestamp}] {text}'
		},
		console: {
			type: 'log',
			format: '[{timestamp} | INFO] {text}',
		},
		info: {
			type: 'info',
			format: '&3[{timestamp} | INFO] {text}'
		},
		success: {
			type: 'info',
			format: '&2[{timestamp} | INFO] {text}'
		},
		debug: {
			type: 'debug',
			format: '&1[{timestamp} | DEBUG] {text}'
		},
		notice: {
			type: 'warn',
			format: '&0&!6[{timestamp} | NOTICE] {text}'
		},
		warn: {
			type: 'warn',
			format: '&6[{timestamp} | WARN] {text}'
		},
		error: {
			type: 'error',
			format: '&4[{timestamp} | ERROR] {text}'
		}
	}
};