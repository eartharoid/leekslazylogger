/**
 * @module leekslazylogger
 * @author eartharoid <contact@eartharoid.me>
 * @description An easy-to-use and lightweight logger for Node.js with colours, timestamps, and files.
 * @copyright 2021 Isaac Saunders (eartharoid)
 * @license MIT
 */

'use strict';

import ConsoleTransport from './transports/console';
import FileTransport from './transports/file';
import Logger from './Logger';

export {
	ConsoleTransport,
	FileTransport,
	Logger
};