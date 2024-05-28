const http = require("http");

const { log, logLevel } = require("@electron-python/logger");

async function checkServerReady({
  host,
  port,
  path = "/",
  timeout = 100,
  retries = 30,
  logger = null, // Logger instance
}) {
  const url = `http://${host}:${port}${path}`;

  const attemptConnection = async (retryCount) => {
    log(
      logger,
      `Attempting to connect to ${url}. Retries left: ${retryCount}`,
      logLevel.verbose
    );

    try {
      const response = await httpGet(url);
      const message = await handleResponse(response, logger, logLevel);
      return message;
    } catch (error) {
      const message = `Fail to connect to ${url}: ${error.message}`;
      log(logger, message, logLevel.warn);
      if (retryCount > 0) {
        await new Promise((resolve) => setTimeout(resolve, timeout));
        return attemptConnection(retryCount - 1);
      } else {
        log(logger, "Server did not become ready in time.", logLevel.error);
        throw new Error("Server did not become ready in time.");
      }
    }
  };

  return attemptConnection(retries);
}

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          resolve({ statusCode: res.statusCode, data });
        });

        res.on("error", (err) => {
          reject(new Error(`HTTP request error: ${err.message}`));
        });
      })
      .on("error", (err) => {
        reject(new Error(`HTTP request error: ${err.message}`));
      });
  });
}

async function handleResponse(response, logger, logLevel) {
  if (response.statusCode === 200) {
    try {
      const jsonData = JSON.parse(response.data);
      const message = `Server response: ${
        jsonData.message || "No message found"
      }`;
      log(logger, message, logLevel.info);
      return message;
    } catch (error) {
      const message = `Error parsing JSON response: ${error.message}`;
      log(logger, message, logLevel.error);
      throw new Error(message);
    }
  } else {
    const message = `Server not ready. Status code: ${response.statusCode}`;
    log(logger, message, logLevel.error);
    throw new Error(message);
  }
}

module.exports = checkServerReady;
