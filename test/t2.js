const ChildLogger = require('../lib').ChildLogger;
const log = new ChildLogger();

module.exports = () => {
	log.console(`This is ${log.options.name}, from &at2.js`);
	log.info('beep');
	log.ex1('This is a test of Child Loggers');

	for (let t in log.custom) log[t](`&d${t} from t2`);

	log.info('&a&l&!3hello from t2.js');
	log.notice('hey');
};