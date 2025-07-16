import EventEmitter from "node:events";
import config from "config";

type LogLevel = "trace" | "debug" | "info" | "warn" | "critical";

interface LogEvent {
    level: LogLevel;
    message: string;
}

const LEVEL_PRIORITY: Record<string, number> = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    critical: 4,
}

export default class Logger {
    public static DEFAULT_LOG_LEVEL: LogLevel = "info";
    public static CONFIG_LEVEL_KEY: string = "log_level";
    private static ERR_PATTERN= (value: string) =>
        `Config key "${Logger.CONFIG_LEVEL_KEY}" value "${value}" is invalid. Expected one of: ${Object.keys(LEVEL_PRIORITY).join(", ")}.`;

    private readonly _currentLogLevel: LogLevel;
    private readonly _emitter= new EventEmitter();

    constructor() {
        this._emitter = new EventEmitter();
        this._currentLogLevel = this.getConfigLevel();
    }

    addLevelHandler(level: LogLevel, messageHandler: (message: string) => void): void {
        this._emitter.on(level, messageHandler);
    }

    log(level: LogLevel, message: string): void {
        this._emitter.emit(level, message);
        if (LEVEL_PRIORITY[level] >= this.currentPriority) {
            this._emitter.emit("log", {level, message});
        }
    }

    addHandler(handler: (e: LogEvent) => void): void {
        this._emitter.on("log", handler);
    }

    get currentLogLevel(): LogLevel {
        return this._currentLogLevel;
    }

    get currentPriority(): number {
        return LEVEL_PRIORITY[this._currentLogLevel];
    }

    private getConfigLevel(): LogLevel {
        if (config.has(Logger.CONFIG_LEVEL_KEY)) {
            const stringValue: string = config.get(Logger.CONFIG_LEVEL_KEY);
            if (!(stringValue in LEVEL_PRIORITY)) {
                throw new Error(`${Logger.ERR_PATTERN(stringValue)}`);
            }
            return (stringValue as LogLevel);
        }
        return Logger.DEFAULT_LOG_LEVEL;
    }
}