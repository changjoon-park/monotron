declare module "@electron-python/subprocess-manager" {
  import { App } from "electron";
  import { Logger } from "@electron-python/logger";

  interface PythonSubprocessOptions {
    app: App;
    logger?: Logger;
    moduleName?: string;
  }

  interface ServerConfig {
    host: string;
    port: number;
    path?: string;
    timeout?: number;
    retries?: number;
  }

  export class PythonSubprocess {
    constructor(options: PythonSubprocessOptions);
    getPythonExePath(): string;
    start(callback?: () => void): void;
    stop(): void;
    checkServerReady(options: ServerConfig): Promise<string>;
    httpGet(url: string): Promise<{ statusCode: number; data: string }>;
    handleResponse(response: {
      statusCode: number;
      data: string;
    }): Promise<string>;
  }

  export function startPythonServer(
    pythonSubprocess: PythonSubprocess,
    serverConfig: ServerConfig
  ): Promise<void>;
}
