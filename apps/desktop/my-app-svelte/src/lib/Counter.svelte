<script>
  let counter = 0;
  function increment() {
    counter += 1;
  }
</script>

<button type="button" class="btn variant-filled" on:click={increment}>
  Count: {counter}
</button>
