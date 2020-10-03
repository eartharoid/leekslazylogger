// const { ChildLogger } = require('../lib');
const ChildLogger = require('../lib');
const log = new ChildLogger();
const leeks = require('leeks.js');

module.exports = () => {
	log.console(log.format(`This is ${log.options.name}, from &at2.js`));
	log.info('beep');
	log.ex1('This is a test of Child Loggers');

	for (let c in leeks.colours) log.test(leeks.colours[c](c));
	for (let t in log.options.types) log[t](t);

	log.info(log.format('&a&l&!3hello from t2.js'));
	log.notice('hey');
};