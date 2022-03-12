import Logger from '../dist';

const log = new Logger({
	transports: [
		new Logger.transports.ConsoleTransport({ level: 'debug' })
	],
});

for (const level in log.options.levels) log[level](`Hello world, I'm ${level}!`);

log.info('testing', '123');
log.error('this is an example,', new Error('not a real error!'));
log.debug('some information', 3, ['Hello', 5], {
	apollo: { falcon: true },
	two: 4,
});
