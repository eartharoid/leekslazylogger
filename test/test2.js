const { emojify } = require('node-emoji');
const Logger = require('../lib');
const log = new Logger({
	name: 'test 2',
	debug: true,
	timestamp: 'DD/MM/YY HH:mm:ss',
	levels: {
		_logger: {
			format: '&7{timestamp} &0&!f logger &r &f{text}'
		},
		basic: {
			format: '&7{timestamp} &f{text}'
		},
		console: {
			format: emojify('&7{timestamp} &0&!f info &r :information_source: &f{text}')
		},
		info: {
			format: emojify('&7{timestamp} &0&!3 info &r :information_source: &f{text}')
		},
		success: {
			format: emojify('&7{timestamp} &0&!2 success &r :white_check_mark: &f{text}')
		},
		debug: {
			format: emojify('&7{timestamp} &0&!1 debug &r :mute: &f{text}')
		},
		notice: {
			format: emojify('&7{timestamp} &0&!e notice &r :mega: &f{text}')
		},
		warn: {
			format: emojify('&7{timestamp} &0&!6 warn &r :warning: &f{text}')
		},
		error: {
			format: emojify('&7{timestamp} &0&!4 error &r :bangbang: &f{text}')
		},
		http: { // a custom one
			format: emojify('&7{timestamp} &0&!5 http &r :globe_with_meridians: &f{text}')
		},
	}
});



for (let t in log.options.levels) log[t](`Hello world, I'm ${t}!`);