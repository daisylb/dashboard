<script lang="typescript">
  import Clock from "./clock.svelte"
  import Calendar from "./calendar/index.svelte"
  import config from './config'
</script>

{#if config.success}
<div id="outer">
  <div id="clock">
    <Clock />
  </div>
  <div id="calendar"><Calendar /></div>
</div>
{:else}
{config.message}
{/if}

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
