<script>
  let counter = 0;
  function increment() {
    counter += 1;
  }
</script>

<button on:click={increment}>
  Count: {counter}
</button>
