import { writable, Writable } from "svelte/store"

function localStorageFactory<T = string>(
  key: string,
  toString?: (value: T) => string,
  fromString?: (storedValue: string) => T,
): Writable<T | undefined> {
  function convertValue(storedValue: string | null): T | undefined {
    if (storedValue === null) return undefined
    if (fromString) return fromString(storedValue)
    return (storedValue as any) as T
  }

  function stringifyValue(value: T | undefined): string | null {
    if (value === undefined) return null
    if (toString) return toString(value)
    return (value as any) as string
  }

  const store = writable(convertValue(localStorage.getItem(key)), (set) => {
    function handler(ev: StorageEvent) {
      if (ev.key !== key) return
      set(convertValue(ev.newValue))
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  })
  const innerSet = store.set
  store.set = (value) => {
    innerSet(value)
    const newString = stringifyValue(value)
    if (newString !== null) localStorage.setItem(key, newString)
    else localStorage.removeItem(key)
  }
  return store
}

export const calendarUrl = localStorageFactory("calendarUrl")
