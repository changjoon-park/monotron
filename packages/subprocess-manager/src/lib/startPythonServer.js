async function startPythonServer(pythonSubprocess, serverConfig) {
  // Start the Python subprocess
  pythonSubprocess.start(async () => {
    // Check if the server is ready
    try {
      const message = await pythonSubprocess.checkServerReady(serverConfig);
      console.log(message); // Server response
    } catch (error) {
      console.error(error.message); // Handle the error
    }
  });
}

module.exports = startPythonServer;
