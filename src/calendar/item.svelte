<script lang="typescript">
  import { DateTime } from "luxon"
  import time from "../time"
  import type { EventOccurrence } from "./lib"

  export let item: EventOccurrence

  const differentDay: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  }

  $: startLocal = item.start.toLocal()
  $: endLocal = item.end.toLocal()
  $: isStarted = $time.diff(item.start).milliseconds > 0
  $: isFinished = $time.diff(item.end).milliseconds > 0
  $: startFormat = $time.startOf("day").equals(startLocal.startOf("day"))
    ? DateTime.TIME_SIMPLE
    : differentDay
  $: endFormat = $time.startOf("day").equals(endLocal.startOf("day"))
    ? DateTime.TIME_SIMPLE
    : differentDay
</script>

<div id="root" class:finished={isFinished}>
  <div id="infobar">
    <div id="absDate">
      {startLocal.toLocaleString(
        startFormat,
      )}&thinsp;&ndash;&thinsp;{endLocal.toLocaleString(endFormat)}
    </div>
    <!-- the `$time &&` doesn't actually affect the output, but forces a re-render every minute -->
    {#if isStarted}
      {#if isFinished}ended{:else}ends{/if}
      {$time && item.end.toRelative({ style: "narrow" })}
    {:else}
      {$time && item.start.toRelative({ style: "narrow" })}
    {/if}
  </div>
  <div id="description">
    {item.event.summary}
  </div>
</div>

<style>
  #root {
    font-size: 2vh;
    margin: 1vh;
  }
  #root.finished {
    opacity: 0.6;
  }
  #infobar {
    font-size: 1.7vh;
    display: flex;
    flex-direction: row;
  }
  #absDate {
    flex: 1;
  }
  #description {
    font-size: 2.5vh;
  }
</style>
