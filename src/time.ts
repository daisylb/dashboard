import { readable } from "svelte/store"
import { DateTime } from "luxon"

export default readable<DateTime>(DateTime.now(), function start(set) {
  let timeoutRef: ReturnType<typeof setTimeout>
  function tick() {
    const now = DateTime.now()
    set(now)
    timeoutRef = setTimeout(tick, now.endOf("minute").diffNow().milliseconds)
  }
  tick()
  return function stop() {
    clearTimeout(timeoutRef)
  }
})
