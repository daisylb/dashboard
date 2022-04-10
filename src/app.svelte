<script lang="typescript">
  import Clock from "./clock.svelte"
  import Calendar from "./calendar/index.svelte"
  import config from './config'
import Timetable from "./timetable/index.svelte"
</script>

{#if config.success}
<div id="outer">
  <div id="clock">
    <Clock />
  </div>
  <div id="calendar"><Calendar /></div>
  <div id="timetable"><Timetable /></div>
</div>
{:else}
{config.message}
{/if}

<style>
  :global(body) {
    background-color: black;
    color: white;
    font-family: Inter, sans-serif;
    margin: 0;
    padding: 0;
  }
  #outer {
    display: grid;
    height: 100vh;
    grid-template: "clock clock" 30vh "calendar timetable" auto / 1fr 1fr;
  }
  #clock {
    grid-area: clock;
  }
  #calendar {
    grid-area: calendar;
  }
  #timetable {
    grid-area:  timetable;
  }
</style>
