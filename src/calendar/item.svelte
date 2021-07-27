<script lang="typescript">
  import { DateTime } from "luxon"
  import time from "../time"
  import type { EventOccurrence } from "./lib"

  export let item: EventOccurrence

  $: isStarted = $time.diff(item.start).milliseconds > 0
  $: isFinished = $time.diff(item.end).milliseconds > 0
  $: endFormat =
    item.end.startOf("day").equals(item.start.startOf("day"))
      ? DateTime.TIME_SIMPLE
      : DateTime.DATETIME_SHORT
</script>

<div id="root" class:finished={isFinished}>
  <div id="infobar">
    <div id="absDate">
      {item.start.toLocaleString(
        DateTime.DATETIME_SHORT,
      )}&thinsp;&ndash;&thinsp;{item.end.toLocaleString(endFormat)}
    </div>
    {#if isStarted}
      {#if isFinished}ended{:else}ends{/if}
      {item.end.toRelative()}
    {:else}
      {item.start.toRelative()}
    {/if}
  </div>
  <div id="description">
    {item.override?.summary || item.event.summary}
  </div>
</div>

<style>
  #root {
    font-size: 2vh;
    margin: 1vh;
  }
  #root.finished {
    opacity: 0.7;
  }
  #infobar {
    font-size: 2vh;
    display: flex;
    flex-direction: row;
  }
  #absDate {
    flex: 1;
  }
  #description {
    font-size: 3vh;
  }
</style>
