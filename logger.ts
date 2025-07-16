import EventEmitter from "node:events";

type LogLevel = "trace" | "debug" | "info" | "warn" | "critical";

interface LogEvent {
    level: LogLevel;
    message: string;
}

export default class Logger {
    private emitter = new EventEmitter();

    constructor() {
        this.emitter = new EventEmitter();
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
}