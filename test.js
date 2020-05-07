const Logger = require('.');
const log = new Logger({
	name: 'Logger Test',
	custom: {
		ex1: {
			title: 'normal example',
			foreground: 'black', // does not fit any other, leeks colour
			bacgkround: 'bgCyan', // black text on cyan backgrond
			styles: ['bold', '&n']
		},
		ex2: {
			title: 'hex example',
			foreground: '#00FF21' // starts with #, hex
		},
		ex3: {
			title: 'rgb example',
			foreground: ['0', '255', '255'] // is an array, rgb 
		},
		ex4: {
			title: '8bit example',
			foreground: 16 // parses to a number, 8bit
		},
		ex5: {
			title: 'another example',
			foreground: '&a', // starts with &, color code
			background: '&!2' // light green text on dark gren background 
		}
	},
	logToFile: true,
	maxAge: -1,
	keepSilent: false,
	daily: true,
});
const colour = log.c;

let awesome = colour.cyanBright;

console.log(awesome(log.options.name));

// let text1 = log.format("first part", {c: ["black", "bgBlueBright"], s: ["bold", "underline"]})
// let text2 = log.format("second part", {c: ["#000000"], s: ["bold", "underline"]})
// log.console(text1 + text2)
// log.console("text", {c: ["f", "b"], s: ["bold", "underline"]})

log.info('message with %s', {c: ['foreground', 'background'], s: ['bold', 'underline'], insert:['string insertion']});

console.log(log.c.redBright('red'));
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



console.log('should be white');

log.info('INFOOOOOO');
log.warn('warning');

setTimeout(() => {
	log.info('beep');
}, 1000);


log.basic('basic');
log.console('console');
log.info('info');
log.success('success');
log.debug('debug');
log.warn('warn');
log.error('error');

// require('.').init() // test legacy warning message

