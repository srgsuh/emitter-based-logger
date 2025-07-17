import {describe, it, expect} from "vitest";
import Logger from "../src/logger";

describe("Logger basic", () => {
   it("Default log level should be info", () => {
        const logger: Logger = new Logger();
        expect(logger.currentLogLevel).equals("info");
   })
});
