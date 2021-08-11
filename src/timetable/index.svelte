<script lang="typescript">
  import poll, { LOADING } from "../poll"
  import config from "../config"
  import * as _ from "underscore"
  import Departure from "./departure.svelte"

  if (!config.success) throw new Error("config failed")
  const appConfig = config.value.departures
  const timetable = poll(async (signal) => {
    const resp = await fetch(
      "/.netlify/functions/proxy?url=" +
        encodeURIComponent(
          `http://timetableapi.ptv.vic.gov.au/v3/departures/route_type/1/stop/${appConfig.stopId}?max_results=10&expand=Run&expand=Route&expand=VehicleDescriptor&expand=Direction`,
        ),
    )
    const json = await resp.json()
    const departuresByDirectionGroup = appConfig.directionGroups.map(
      (directions) =>
        json.departures.filter(
          (x) => directions.indexOf(x.direction_id) !== -1,
        ),
    )
    console.log(json, departuresByDirectionGroup)
    return { ...json, departuresByDirectionGroup }
  }, 60_000)
</script>

{#if $timetable !== LOADING}
  {#each $timetable.departuresByDirectionGroup as group}
    <div class="direction">
      {#each _.first(group, 3) as dep}
        <Departure
          departure={dep}
          allRoutes={$timetable.routes}
          allDirections={$timetable.directions}
        />
      {/each}
    </div>
  {/each}
{/if}

<style>
  .direction {
    margin-bottom: 3vh;
  }
</style>
