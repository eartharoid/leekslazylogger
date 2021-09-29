const Logger = require('../dist');
/*
 * const {
 * 	ConsoleTransport,
 * 	FileTransport
 * } = require('../dist/transports');
 */

const log = new Logger({ namespaces: ['http'] });

log.info('test');
log.success.http('web server');
