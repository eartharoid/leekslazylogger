import {
	Log,
	PartialLoggerOptions,
	TransportOptions
} from './types';

export default abstract class Transport {
	public level: string;
	public logger: PartialLoggerOptions | undefined;

	constructor(options: TransportOptions) {
		this.level = options.level;
	}

	abstract write(log: Log): void
}