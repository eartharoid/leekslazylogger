import {
	Log,
	LoggerOptions,
	Partial,
	TransportOptions
} from './types';

export default abstract class Transport {
	public level: string;
	public logger: Partial<LoggerOptions> | undefined;

	constructor(options: TransportOptions) {
		this.level = options.level;
	}

	abstract write(log: Log): void
}