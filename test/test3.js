const Logger = require('../lib');
const log = new Logger({
	name: 'test 3',
	debug: true,
	header: false,
});

for (let t in log.options.levels) log[t](`this is a ${t} log`);