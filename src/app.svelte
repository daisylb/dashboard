<script lang="typescript">
  import Clock from "./clock.svelte"
  import Calendar from "./calendar/index.svelte"
</script>

<div id="outer">
  <div id="clock">
    <Clock />
  </div>
  <div id="calendar"><Calendar /></div>
</div>

<style>
  :global(body) {
    background-color: black;
    color: white;
    font-family: Inter, sans-serif;
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
