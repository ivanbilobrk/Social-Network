import { Logger } from 'tslog';
import config from './index.js';

const logger: Logger = new Logger({ minLevel: config.logLevel });

export default logger;
