
import Logger from './src/logger.ts';

const logger = new Logger();

const consoleHandler = logger.subscribe(e => console.log(e.message));
logger.subscribe(consoleHandler);
logger.addLevelHandler("info", s => console.log("INFO EVENT HANDLER: " + s));



logger.log("info", "Hello from INFO!");
logger.log("critical", "Hello from CRITICAL!");

logger.unsubscribe(consoleHandler);

logger.log("info", "Hello from INFO!");
logger.log("critical", "Hello from CRITICAL!");
