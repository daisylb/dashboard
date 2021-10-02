<script lang="typescript">
  import { DateTime } from "luxon"
  import Item from "./item.svelte"
  import * as lib from "./lib"
  import config from "../config"
  import poll, { LOADING } from "../poll"
  import ICAL from "ical.js"

  const calendarUrls = config.success ? config.value.calendarUrls : []
  let todaysEvents = poll(async (signal) => {
    const texts = await Promise.all(
      calendarUrls.map((url) => fetch(url, { signal }).then((x) => x.text())),
    )
    const cals = texts.map((text) => {
      const jc = ICAL.parse(text)
      const comp = new ICAL.Component(jc)
      return comp.getAllSubcomponents("vevent").map((e) => new ICAL.Event(e))
    })
    const today = DateTime.now().startOf("day")
    const tomorrow = today.plus({ days: 1 })
    return cals
      .flatMap((cal) => [...lib.getEventsInRange(cal, today, tomorrow)])
      .sort((a, b) => a.start.valueOf() - b.start.valueOf())
  }, 300_000)
  $: (window as any).todaysEvents = $todaysEvents
</script>

<div>
  {#if $todaysEvents !== LOADING}
    {#each $todaysEvents as event}
      <Item item={event} />
    {/each}
  {/if}
</div>
