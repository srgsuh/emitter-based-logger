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
    public static DEFAULT_LEVEL: LogLevel = "info";
    public static CONFIG_LEVEL_KEY: string = "log_level";
    private static ERR_PATTERN= (value: string) =>
        `Config key "${Logger.CONFIG_LEVEL_KEY}" value "${value}" is invalid. Expected one of: ${Object.keys(LEVEL_PRIORITY).join(", ")}.`;

    private priority: number = LEVEL_PRIORITY[Logger.DEFAULT_LEVEL];
    private emitter = new EventEmitter();

    constructor() {
        this.emitter = new EventEmitter();
        this.priority = LEVEL_PRIORITY[this.getConfigLevel()];
    }

    addLevelHandler(level: LogLevel, messageHandler: (message: string) => void): void {
        this.emitter.on(level, messageHandler);
    }

    log(level: LogLevel, message: string): void {
        this.emitter.emit(level, message);
        this.emitter.emit("log", {level, message});
    }

    addHandler(handler: (e: LogEvent) => void): void {
        this.emitter.on("log", handler);
    }

    private getConfigLevel(): LogLevel {
        if (config.has(Logger.CONFIG_LEVEL_KEY)) {
            const stringValue: string = config.get(Logger.CONFIG_LEVEL_KEY);
            if (!(stringValue in LEVEL_PRIORITY)) {
                throw new Error(`${Logger.ERR_PATTERN(stringValue)}`);
            }
            return (stringValue as LogLevel);
        }
        return Logger.DEFAULT_LEVEL;
    }
}