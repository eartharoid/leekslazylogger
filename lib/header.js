/**
 * @name leekslazylogger
 * @author eartharoid <contact@eartharoid.me>
 * @description An easy-to-use and lightweight Node.JS logger with file support, colours, and timestamps.
 * @license MIT
 *
 * log file header template - cleans up main file
 *
 */

const dtf = require('@eartharoid/dtf');
const { version, author, homepage } = require('../package.json');

const platform = (() => {
	switch (process.platform.toLowerCase()) {
	case 'aix': return 'Unix';
	case 'sunos': return 'SunOS';
	case 'win32': return 'Windows';
	case 'linux': return 'Linux';
	case 'darwin': return 'MacOS';
	case 'freebsd': return 'BSD';
	case 'openbsd': return 'BSD';
	default: 'unknown platform';
	}
})();

module.exports = (o) => {
	if (!o.header) return '';
	else return `
    \n<-<-<================================================================================>->->
    Logging by leekslazylogger v${version} by ${author.name} (${homepage})
    ${o.name} (Node ${process.version} on '${platform}')
    ${dtf('DDDD, n_D MMMM YYYY, HH:mm AMPM')} (${Intl.DateTimeFormat().resolvedOptions().timeZone}) -->
    Time format: '${o.timestamp}'
<-<-<================================================================================>->->\n
`;
};