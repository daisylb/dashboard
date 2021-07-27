import { readable, Readable } from "svelte/store"
import { DateTime } from "luxon"

export const LOADING = Symbol("LOADING")

export default function createPolledValue<T>(
  callable: (signal: AbortSignal) => Promise<T>,
  interval: number,
): Readable<T | typeof LOADING> {
  return readable<T | typeof LOADING>(
    LOADING,
    function polledValueInitialiser(set) {
      let abortController = new AbortController()
      let timeoutRef: ReturnType<typeof setTimeout>
      async function tick() {
        try {
          set(await callable(abortController.signal))
        } catch (e) {
          console.error(e)
        }
        timeoutRef = setTimeout(tick, interval)
      }
      tick()
      return function polledValueCanceller() {
        clearTimeout(timeoutRef)
        abortController.abort()
      }
    },
  )
}
