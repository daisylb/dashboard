<script lang="typescript">
  import ptvPalette from './ptvPalette'
  export var departure: any
  export var allRoutes: any
  export var allDirections: any
  import now from "../time"
  import { DateTime } from "luxon"
  $: departsAt = DateTime.fromISO(departure.estimated_departure_utc)
  console.log(departure, departsAt)
  $: departsInMin = Math.floor(departsAt.diff($now, "minutes").minutes)
  $: route = allRoutes[departure.route_id]
  $: [routeBg, routeText] = ptvPalette[route.route_number as keyof ptvPalette]
</script>

<div class="departure">
  <div class="routeNumber" style={`background-color: ${routeBg}; color: ${routeText}`}>{allRoutes[departure.route_id].route_number}</div>
  <div class="direction">
    {allDirections[departure.direction_id].direction_name}
  </div>
  <div class="departsIn">
    {#if departsInMin < 1}
      now
    {:else}
      {departsInMin}
    {/if}
  </div>
</div>

<style>
  .departure {
    display: flex;
    align-items: center;
  }
  .direction {
    flex: 1;
    font-size: 1.5vh;
    padding: 0.5vh;
  }
  .routeNumber,
  .departsIn {
    font-size: 4vh;
    width: 8vh;
    text-align: center;
    margin: 0.5vh;
  }
</style>
