const Logger = require('../lib');
const log = new Logger({
	name: 'test 2',
	format: ({ timestamp, title, prefix, text }) => {
		title = title ? title.toLowerCase() : '';
		prefix = prefix ? prefix.toLowerCase() : '';
		return `${timestamp} ${title} ${prefix} ${text}`;
	},
});

for (let t in log.defaults.types) log[t]('some text here');