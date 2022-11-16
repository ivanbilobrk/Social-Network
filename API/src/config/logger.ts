import { Logger } from 'tslog';
import config from './index';

const logger: Logger = new Logger({ minLevel: config.logLevel });

export default logger;
