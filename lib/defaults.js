module.exports = {
	name: 'A leekslazylogger project',
	logToFile: true,
	format: ({ timestamp, title, prefix, text }) => 
		`[${timestamp}${title ? ` | ${title.trim().toUpperCase()}` : ''}] ${prefix ? `[${prefix.trim().toUpperCase()}] ` : ''}${text}`,
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