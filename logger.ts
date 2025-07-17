import EventEmitter from "node:events";
import config from "config";

type LogLevel = "trace" | "debug" | "info" | "warn" | "critical";

interface LogEvent {
    level: LogLevel;
    message: string;
}

type LogHandler = (e: LogEvent) => void;

type MessageHandler = (message: string) => void;

const LEVEL_PRIORITY: Record<string, number> = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    critical: 4,
}

class LoggerConfigError extends Error {}

export default class Logger {
    public static DEFAULT_LOG_LEVEL: LogLevel = "info";
    public static CONFIG_LEVEL_KEY: string = "log_level";

    private _currentLogLevel: LogLevel;
    private emitter: EventEmitter;

    constructor() {
        this._currentLogLevel = this.getConfigLevel();
        this.emitter = new EventEmitter();
    }

    log(level: LogLevel, message: string): void {
        this.emitter.emit(level, message);
        if (LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[this._currentLogLevel]) {
            this.emitter.emit("log", {level, message});
        }
    }

    addLevelHandler(level: LogLevel, messageHandler: MessageHandler): MessageHandler {
        this.emitter.on(level, messageHandler);
        return messageHandler;
    }

    removeLevelHandler(level: LogLevel, messageHandler: MessageHandler): void {
        this.emitter.off(level, messageHandler);
    }

    subscribe(handler: LogHandler): LogHandler {
        this.emitter.on("log", handler);
        return handler;
    }

    unsubscribe(handler: LogHandler): void {
        this.emitter.off("log", handler);
    }

    get currentLogLevel(): LogLevel {
        return this._currentLogLevel;
    }

    private getConfigLevel(): LogLevel {
        const key = Logger.CONFIG_LEVEL_KEY;
        const level = config.has(key)? config.get(key) as LogLevel : Logger.DEFAULT_LOG_LEVEL;
        if (!(level in LEVEL_PRIORITY)) {
            throw new LoggerConfigError(`Config key "${Logger.CONFIG_LEVEL_KEY}" value is invalid. \
Expected one of: ${Object.keys(LEVEL_PRIORITY).join(", ")}.`);
        }
        return level;
    }
}