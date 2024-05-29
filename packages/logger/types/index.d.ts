declare module "@monotron/logger" {
  import { App } from "electron";

  interface LoggerOptions {
    app: App;
    logPath?: string;
    logLevel?: string;
    logFileName?: string;
    logMaxSize?: number;
    logMaxFiles?: number;
  }

  export class Logger {
    constructor(options: LoggerOptions);
    debug(message: string): void;
    info(message: string): void;
    error(message: string): void;
    warn(message: string): void;
    verbose(message: string): void;
  }
}
