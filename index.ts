
import Logger from './logger.ts';

const logger = new Logger();

logger.addHandler(e => console.log(e.message));
logger.addLevelHandler("info", s => console.log("INFO: " + s));


logger.log("trace", "Hello from TRACE!");
logger.log("debug", "Hello from DEBUG!");
logger.log("info", "Hello from INFO!");
logger.log("warn", "Hello from WARN!");
logger.log("critical", "Hello from CRITICAL!");
