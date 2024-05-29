<script>
  export let logos = { svelteLogo, fastapiLogo, electronLogo };

  const addresses = {
    Electron: {
      url: "https://www.electronjs.org/",
      logo: logos.electronLogo,
      color: "#646cffaa",
    },
    FastAPI: {
      url: "https://fastapi.tiangolo.com/",
      logo: logos.fastapiLogo,
      color: "#43a6c7aa",
    },
    Svelte: {
      url: "https://svelte.dev",
      logo: logos.svelteLogo,
      color: "#ff3e00aa",
    },
  };
</script>

{#each Object.entries(addresses) as [name, { url, logo, color }]}
  <a href={url} target="_blank" rel="noreferrer">
    <img
      src={logo}
      class="h-24 transition-transform duration-300 hover:drop-shadow-[0_0_2em_{color}]"
      alt="{name} Logo"
    />
  </a>
{/each}
