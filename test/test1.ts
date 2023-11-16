import { Logger } from '../dist';

const log = new Logger({ namespaces: ['http'] });

log.info('test');
log.success.http('web server');

for (const level in log.options.levels) log[level](`Hello world, I'm ${level}!`);

log.options = { namespaces: ['http', 'database'] };
log.info.database('new: database');
log.info.http('and http still works!');