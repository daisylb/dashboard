import type * as ical from "ical"
import { DateTime } from "luxon"

export type EventOccurrence = {
  start: DateTime
  end: DateTime
  event: ical.CalendarComponent
  override?: ical.CalendarComponent
}

export function* getEventsInRange(
  calendar: ical.FullCalendar,
  start: DateTime,
  end: DateTime,
): Iterable<EventOccurrence> {
  const startJS = start.toJSDate()
  const endJS = end.toJSDate()

  for (const eventID of Object.keys(calendar)) {
    const event = calendar[eventID]

    if (event.type !== "VEVENT") continue

    if (!event.start || !event.end) {
      console.warn(`Event ${eventID} missing start and end`, event)
      continue
    }

    if (event.rrule) {
      const eventDuration = DateTime.fromJSDate(event.end).diff(
        DateTime.fromJSDate(event.start),
      )
      const exceptions = new Set(
        event.exdate ? Object.keys(event.exdate) : undefined,
      )

      // First, go through every recurrence, finding ones in the range we
      // want. Note that `recurrences` is an *empty array* which has
      // own *properties* (not array entries!) with ISO date keys because the
      // API for this library is absolutely bananas; also despite the name a 'recurrence' is actually an override of sorts
      if (event.recurrences) {
        for (const overrideKey in event.recurrences) {
          if (!event.recurrences.hasOwnProperty(overrideKey)) continue
          const override = event.recurrences[overrideKey]
          if (!override.start || !override.end) {
            console.warn(
              `Event ${override.recurrenceid} (a recurrence of ${eventID}) missing start and end`,
            )
            continue
          }
          const evtStart = DateTime.fromJSDate(override.start)
          exceptions.add(overrideKey)
          if (start < evtStart && evtStart < end) {
            const evtEnd = DateTime.fromJSDate(override.end)
            yield { start: evtStart, end: evtEnd, event, override }
          }
        }
      }

      for (const startDate of event.rrule.between(startJS, endJS)) {
        const evtStart = DateTime.fromJSDate(startDate)
        if (exceptions.has(evtStart.toFormat("yyyy-LL-dd"))) continue
        const evtEnd = evtStart.plus(eventDuration)
        yield { start: evtStart, end: evtEnd, event }
      }
    } else {
      const evtStart = DateTime.fromJSDate(event.start)
      if (start < evtStart && evtStart < end) {
        const evtEnd = DateTime.fromJSDate(event.end)
        yield { start: evtStart, end: evtEnd, event }
      }
    }
  }
}
