/*
 * require('./test1');
 * require('./test2');
 * require('./test3');
 */

const Logger = require('../dist');
const log = new Logger({
	namespaces: ['http'],
	// transports: [new Logger.transports.ConsoleTransport()]
});
log.info('test');
log.success.http('web server');