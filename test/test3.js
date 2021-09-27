const Logger = require('../dist');
const log = new Logger({
	name: 'test 3',
	debug: true,
	header: false,
});

for (let t in log.options.levels) log[t](`this is a ${t} log`);

console.log(Logger.f('&#!000&#16DC3Bhello'));
