const Logger = require('../lib');
const leeks = require('leeks.js');

module.exports = (log) => {
	log.console(Logger.format(`This is ${log.options.name}, from &at2.js`));
	log.info('beep');
	log.ex1('Hello world!');

	for (let c in leeks.colours) log.test(leeks.colours[c](c));
	for (let t in log.options.types) log[t](t);

	log.info(Logger.format('&a&l&!3hello from t2.js'));
	log.notice('hey');
};