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

<main>
  <div>
    <a href="https://www.electronjs.org/" target="_blank" rel="noreferrer">
      <img src={electronLogo} class="logo" alt="Electron Logo" />
    </a>
    <a href="https://fastapi.tiangolo.com/" target="_blank" rel="noreferrer">
      <img src={fastapiLogo} class="logo fastapi" alt="FastAPI Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Electron + FastAPI + Svelte</h1>

  <div class="card">
    <Counter />
  </div>

  <p>
    This is a template for building desktop applications using Electron,
    FastAPI, and Svelte.
  </p>

  <p class="read-the-docs">{fetchedData}</p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.fastapi:hover {
    filter: drop-shadow(0 0 2em #43a6c7aa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
