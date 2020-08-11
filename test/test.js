const Logger = require('../lib');
const log = new Logger(require('./logger'));

log.console(log.f(`&b${log.options.name}`));
log.error({error: 'test'});

log.info(log.format('&1whiteBright'), ['black', 'whiteBright']); // bg works if you forget to use a bg colour name
log.info(log.format('&1bgWhiteBright'), ['black', 'bgWhiteBright']);

log.console('rgb', ['0,0,253', '255,255,255']);
log.console('hex', ['#009999', '#111111']);
log.console('8bit', [16, 11]);
log.console('code', ['&3', '&1']); // &1 will become &!1
log.console('mix', ['&1', '#111111']);

log.console(log.format('&a&lThis should be light &c&o&kgreen&a&l and &nbold'));
log.console(log.format('&00&r     &11&r     &22&r     &33&r     &44&r     &55&r     &66&r     &77&r     &88&r     &99'));
log.console(log.format('&aa&r     &bb&r     &cc&r     &dd&r     &ee&r     &ff'));
log.console(log.format('&!0!0&r    &!1!1&r    &!2!2&r    &!3!3&r    &!4!4&r    &!5!5&r    &!6!6&r    &!7!7&r    &!8!8&r    &!9!9&r'));
log.console(log.format('&!a!a&r    &!b!b&r    &!c!c&r    &!d!d&r    &!e!e&r    &!f!f&r'));

log.console(log.format('&a&l&!3(codes)'));


/**
 * MULTI LOGGER
 */

log.multi(log); // must be called in main before creating a Child Logger in another file

log.console(log.format('&0&!9START OF T2'));
require('./t2')(); // alternatively, do `require('./t2')(log)` without child loggers
log.console(log.format('&0&!9END OF T2'));




log.info('INFOOOOOO');
log.warn('warning');

setTimeout(() => {
	log.info('beep');
}, 1000);

// setInterval(() => {
// 	log.warn(log.stamp());
// }, 1000);


log.basic('basic');
log.console('console');
log.info('info');
log.success('success');
log.debug('debug');
log.warn('warn');
log.notice('notice');
log.error('error');

log.debug(log.path);

log.warn([{a: [1]}, 0, '']);
log.warn(1);
log.console(log.format('&ahello'));

// require('.').init(); // test legacy warning message