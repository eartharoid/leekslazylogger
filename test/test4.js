const Logger = require('../dist');

const log = new Logger({
	transports: [
		new Logger.transports.ConsoleTransport(),
		new Logger.transports.FileTransport({
			clean_directory: 0,
			name: 'Test 4',
		})
	]
});

log.info('%s %d information', 'some' , 3, '!');
log.warn('#%d (%s) ctx: %o', 3, ['Hello', 5], {
	apollo: { falcon: true },
	two: 4
});