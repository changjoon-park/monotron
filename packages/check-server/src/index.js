const http = require("http");

function waitForServerReady({
  host,
  port,
  path = "/",
  timeout = 100,
  retries = 30,
}) {
  return new Promise((resolve, reject) => {
    const attemptConnection = (retryCount) => {
      const url = `http://${host}:${port}${path}`;
      console.log(
        `Attempting to connect to ${url}. Retries left: ${retryCount}`
      );

      http
        .get(url, (res) => {
          let data = "";

          // Listen for data chunks
          res.on("data", (chunk) => {
            data += chunk;
          });

          // End of response
          res.on("end", () => {
            if (res.statusCode === 200) {
              try {
                const jsonData = JSON.parse(data);
                const message = jsonData.message || "No message found";
                console.log(`Server response: ${message}`);
                resolve(message);
              } catch (error) {
                console.log(`Error parsing JSON response: ${error.message}`);
                reject(error);
              }
            } else {
              console.log(
                `Server not ready. Status code: ${res.statusCode}. Retrying...`
              );
              retry(retryCount);
            }
          });
        })
        .on("error", (err) => {
          console.log(`Server not ready. Error: ${err.message}. Retrying...`);
          retry(retryCount);
        });
    };

    const retry = (retryCount) => {
      if (retryCount > 0) {
        setTimeout(() => attemptConnection(retryCount - 1), timeout);
      } else {
        reject(new Error("Server did not become ready in time."));
      }
    };

    attemptConnection(retries);
  });
}

module.exports = waitForServerReady;
