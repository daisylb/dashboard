<script lang="typescript">
  import Clock from "./clock.svelte"
</script>

<div id="outer">
  <div id="clock">
    <Clock />
  </div>
</div>

<style>
  :global(body) {
    background-color: black;
    color: white;
  }
  #outer {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  #clock {
    height: 30vh;
  }
</style>
