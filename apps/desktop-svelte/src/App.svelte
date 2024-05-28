<script>
  import { onMount } from "svelte";
  import svelteLogo from "./assets/svelte.svg";
  import fastapiLogo from "./assets/fastapi.svg";
  import electronLogo from "./assets/electron.svg";
  import Counter from "./lib/Counter.svelte";

  let fetchedData = "";

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  onMount(async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data); // Log the response to check its structure
      fetchedData =
        `${data.status} (${data.ip}:${data.port}/${data.path})` ||
        "No message found"; // Access nested message property
    } catch (error) {
      fetchedData = "Failed to load data.";
      console.error("Error fetching data:", error);
    }
  });
</script>

<main
  class="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white"
>
  <div class="flex justify-center space-x-20 mb-8">
    <a href="https://www.electronjs.org/" target="_blank" rel="noreferrer">
      <img
        src={electronLogo}
        class="h-24 transition-transform duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]"
        alt="Electron Logo"
      />
    </a>
    <a href="https://fastapi.tiangolo.com/" target="_blank" rel="noreferrer">
      <img
        src={fastapiLogo}
        class="h-24 transition-transform duration-300 hover:drop-shadow-[0_0_2em_#43a6c7aa]"
        alt="FastAPI Logo"
      />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img
        src={svelteLogo}
        class="h-24 transition-transform duration-300 hover:drop-shadow-[0_0_2em_#ff3e00aa]"
        alt="Svelte Logo"
      />
    </a>
  </div>
  <h1 class="text-5xl font-bold my-4">Electron + FastAPI + Svelte</h1>

  <div class="card bg-gray-700 p-4 my-4 rounded-lg shadow-lg">
    <Counter />
  </div>

  <p class="mt-4 text-lg">
    This is a template for building desktop applications using Electron,
    FastAPI, and Svelte.
  </p>

  <p class="read-the-docs mt-2 text-gray-400">{fetchedData}</p>
</main>
