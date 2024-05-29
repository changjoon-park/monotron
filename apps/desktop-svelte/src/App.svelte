<script>
  import { onMount } from "svelte";
  import svelteLogo from "./assets/svelte.svg";
  import fastapiLogo from "./assets/fastapi.svg";
  import electronLogo from "./assets/electron.svg";
  import Counter from "./lib/Counter.svelte";
  import Logo from "./lib/Logo.svelte";

  let fetchedData = "";
  let logos = { svelteLogo, fastapiLogo, electronLogo };

  const API_BASE_URL = "http://localhost:4040/api/";

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
