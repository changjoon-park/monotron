<script>
  import { onMount } from "svelte";
  import axios from 'axios';
  import axiosRetry from 'axios-retry';
  import dotenv from 'dotenv';

  import svelteLogo from "./assets/svelte.svg";
  import fastapiLogo from "./assets/fastapi.svg";
  import electronLogo from "./assets/electron.svg";
  import Counter from "./lib/Counter.svelte";
  import Logo from "./lib/Logo.svelte";

  let fetchedData = "Fetching data...";
  let logos = { svelteLogo, fastapiLogo, electronLogo };

  // Define the base URL for the API from python backend
  const API_BASE_URL = process.env.VITE_API_BASE_URL;

  // Retry failed requests up to 10 times with exponential backoff
  axiosRetry(axios, { retries: 10, retryDelay: axiosRetry.exponentialDelay });

  onMount(async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      const data = response.data;
      console.log(data); // Log the response to check its structure
      fetchedData = `${data.status} (http://${data.ip}:${data.port}/${data.path})` || "No message found"; // Access nested message property
    } catch (error) {
      fetchedData = "Failed to load data.";
      console.error("Error fetching data:", error);
    }
  });
</script>

<main
  class="flex flex-col items-center justify-center min-h-screen "
>
  <div class="flex justify-center space-x-20 mb-8">
    <Logo {logos} />
  </div>
  <h1 class="text-5xl font-bold my-4">Electron + FastAPI + Svelte</h1>

  <div class="cardp-4 my-4">
    <Counter />
  </div>

  <p class="mt-4 text-lg">
    This is a template for building desktop applications using Electron,
    FastAPI, and Svelte.
  </p>

  <p class="read-the-docs mt-2 text-gray-400">{fetchedData}</p>
</main>
