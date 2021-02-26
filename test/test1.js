const leeks = require('leeks.js');
const Logger = require('../lib');
const log = new Logger({
	name: 'Logger Test',
	// directory: require('path').join(__dirname, '/special-logs'),
	// timestamp: 'DD/MM/YY HH:mm:ss',
	// timestamp: () => Date.now(),
	levels: {
		test: {
			format: '[{timestamp} | TEST] {text}'
		},
		ex1: {
			format: '&0&!3[{timestamp} | NORMAL EXAMPLE] {text}'
		},
		ex2: {
			type: 'warn',
			format: leeks.hex('#00FF21', '[{timestamp} | HEX] {text}')
		},
		ex3: {
			type: 'error',
			format: () => leeks.rgb([0, 255, 255], '[{timestamp} | RGB EXAMPLE] {text}') // can also be a function
		},
		ex4: {
			format: leeks.eightBitBg(16, '[{timestamp} | 8BIT EXAMPLE] {text}')
		},
		ex5: {
			format: '&1&!2[{timestamp} | ANOTHER EXAMPLE] {text}'
		},
		thing: {
			format: '[{timestamp} | TEST] [THING] {text}'
		},
		warn: {
			format: '&6[{timestamp} | WARN] [OH NO! A WARNING!] {text}'
		}
	},
	logToFile: true,
	maxAge: 1,
	keepSilent: false,
	daily: true,
	debug: true
});

log.console(Logger.f(`&b${log.options.name}`));
log.error({ error: 'test' });

log.console(Logger.format(`This is ${log.options.name}, from &atest.js`));
log.info('beep');
log.ex1('Hello world!');

for (let c in leeks.colours) log.test(leeks.colours[c](c));
for (let t in log.options.levels) log[t](t);

log.info(Logger.format('&a&l&!3hello from t2.js'));
log.notice('hey');



log.info(Logger.format('&1whiteBright'), ['black', 'whiteBright']); // bg works if you forget to use a bg colour name
log.info(Logger.format('&1bgWhiteBright'), ['black', 'bgWhiteBright']);

log.console('rgb', ['0,0,253', '255,255,255']);
log.console('hex', ['#009999', '#111111']);
log.console('8bit', [16, 11]);
log.console('code', ['&3', '&1']); // &1 will become &!1
log.console('mix', ['&1', '#111111']);

log.console(Logger.format('&a&lThis should be &0light &c&o&kgreen&a&l and &nbold&r&6 (and blinking!)'));
log.console(Logger.format('&00&r     &11&r     &22&r     &33&r     &44&r     &55&r     &66&r     &77&r     &88&r     &99'));
log.console(Logger.format('&aa&r     &bb&r     &cc&r     &dd&r     &ee&r     &ff'));
log.console(Logger.format('&!0!0&r    &!1!1&r    &!2!2&r    &!3!3&r    &!4!4&r    &!5!5&r    &!6!6&r    &!7!7&r    &!8!8&r    &!9!9&r'));
log.console(Logger.format('&!a!a&r    &!b!b&r    &!c!c&r    &!d!d&r    &!e!e&r    &!f!f&r'));

log.console(Logger.format('&a&l&!3(codes)'));

log.info('INFOOOOOO');
log.warn('warning');

setTimeout(() => {
	log.info('beep');
}, 1000);

log.debug(log.path);

log.warn([{a: [1]}, 0, '']);
log.warn(1);
log.console(Logger.format('&ahello'));

log.ex1(log.options.name);

log.console(Logger.format('&0&!9START OF T2'));
log.console(Logger.format('&0&!9END OF T2'));

console.log('hey');
log.error(new Error('This is not a real error'));

log.console(undefined);
log.console(null);
log.console({});
log.console('');
log.console(0);
