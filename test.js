const Logger = require('.');
const log = new Logger({
	name: 'Logger Test',
	custom: {
		ex1: {
			title: 'normal example',
			foreground: 'black',
			background: 'bgCyan'
		},
		ex2: {
			title: 'hex example',
			foreground: '#00FF21',
			type: 'warn'
		},
		ex3: {
			title: 'rgb example',
			foreground: '0, 255, 255',
			type: 'error'
		},
		ex4: {
			title: '8bit example',
			foreground: 16 
		},
		ex5: {
			title: 'another example',
			foreground: '&1',
			background: '&!2'
		}
	},
	logToFile: true,
	maxAge: 2,
	keepSilent: false,
	daily: true,
	debug: true,
	translateCodes: true
});

log.console('&b' + log.options.name);
log.error({error: 'test'});

log.info('&1whiteBright', ['black', 'whiteBright']); // bg works if you forget to use a bg colour name
log.info('&1bgWhiteBright', ['black', 'bgWhiteBright']);

log.console('rgb', ['0,0,253', '255,255,255']);
log.console('hex', ['#009999', '#111111']);
log.console('8bit', [16, 11]);
log.console('code', ['&3', '&1']); // &1 will become &!1

log.console('&a&lThis should be light &c&o&kgreen&a&l and &nbold');
log.console('&00&r     &11&r     &22&r     &33&r     &44&r     &55&r     &66&r     &77&r     &88&r     &99');
log.console('&aa&r     &bb&r     &cc&r     &dd&r     &ee&r     &ff');
log.console('&!0!0&r    &!1!1&r    &!2!2&r    &!3!3&r    &!4!4&r    &!5!5&r    &!6!6&r    &!7!7&r    &!8!8&r    &!9!9&r');
log.console('&!a!a&r    &!b!b&r    &!c!c&r    &!d!d&r    &!e!e&r    &!f!f&r');

log.console('&a&l&!3(codes)');

log.multi(log); // must be called in main before creating a Child Logger in another file
log.console('&0&!9START OF T2');
require('./t2')();
log.console('&0&!9END OF T2');


log.info('INFOOOOOO');
log.warn('warning');

setTimeout(() => {
	log.info('beep');
}, 1000);

setInterval(() => {
	log.warn(log.stamp());
}, 1000);


log.basic('basic');
log.console('console');
log.info('info');
log.success('success');
log.debug('debug');
log.warn('warn');
log.notice('notice');
log.error('error');

log.debug(log.path);

// require('.').init(); // test legacy warning message

